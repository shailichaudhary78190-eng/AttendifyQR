import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";

const router = express.Router();

// Admin-only register: assume at least one admin is pre-created or bootstrap
router.post("/register", async (req, res, next) => {
  try {
    const { role, email, password, name } = req.body;
    if (!role || !email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Only allow admin registration through this endpoint
    if (role !== "admin") {
      return res.status(403).json({
        error:
          "Student accounts must be created by admin. Please contact your administrator.",
      });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ role, email, password: hashed, name });
    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    // For students, verify that a student profile exists
    if (user.role === "student") {
      const studentProfile = await StudentProfile.findOne({ userId: user._id });
      if (!studentProfile) {
        return res.status(403).json({
          error:
            "Student profile not found. Please contact administrator to create your profile.",
        });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
