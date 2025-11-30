// Admin routes
// Purpose: Manage students, generate ID cards, and mark attendance once per day.
// Notes: Minimal surface area for production; JWT-protected and admin-only.
import express from "express";
import bcrypt from "bcryptjs";
import { authenticate, authorize } from "../middleware/auth.js";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import AttendanceRecord from "../models/AttendanceRecord.js";
import QRCode from "qrcode";

const router = express.Router();

// All admin routes require valid JWT and admin role
router.use(authenticate, authorize("admin"));

// Students
// List all students (basic fields for dashboard)
router.get("/students", async (req, res, next) => {
  try {
    const students = await StudentProfile.find()
      .populate("userId", "name email")
      .lean();
    const formatted = students.map((s) => ({
      id: s._id,
      rollNumber: s.rollNumber,
      name: s.userId?.name,
      email: s.userId?.email,
      department: s.department,
      semester: s.semester,
      section: s.section,
    }));
    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

// Create a student + linked user with a generated QR token
router.post("/students", async (req, res, next) => {
  try {
    const {
      email,
      name,
      rollNumber,
      department,
      semester,
      section,
      photo,
      subjects,
    } = req.body;
    if (
      !email ||
      !name ||
      !rollNumber ||
      !department ||
      !semester ||
      !section
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email already registered" });

    const existingRoll = await StudentProfile.findOne({ rollNumber });
    if (existingRoll)
      return res.status(409).json({ error: "Roll number already exists" });

    const hashedPassword = await bcrypt.hash("student123", 10);
    const user = await User.create({
      role: "student",
      email,
      password: hashedPassword,
      name,
    });

    // generate unique qrToken
    const qrToken = `STU${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 5)
      .toUpperCase()}`;

    const profile = await StudentProfile.create({
      userId: user._id,
      rollNumber,
      department,
      semester,
      section,
      photo: photo || "",
      qrToken,
      subjects: subjects || [],
    });

    res.status(201).json({
      success: true,
      message: `Student ${name} created successfully`,
      id: profile._id,
      qrToken,
      defaultPassword: "student123",
    });
  } catch (err) {
    next(err);
  }
});

// Generate ID card details and QR image (data URL)
router.get("/students/:id/id-card", async (req, res, next) => {
  try {
    const student = await StudentProfile.findById(req.params.id)
      .populate("userId", "name email")
      .lean();
    if (!student) return res.status(404).json({ error: "Student not found" });
    const qrDataUrl = await QRCode.toDataURL(student.qrToken, { scale: 6 });
    res.json({
      student: {
        name: student.userId?.name,
        email: student.userId?.email,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester,
        section: student.section,
        photo: student.photo,
      },
      qr: qrDataUrl,
    });
  } catch (err) {
    next(err);
  }
});

// Mark attendance - once per day
// Mark attendance for a student by QR token; restricted to once per day
router.post("/mark-attendance", async (req, res, next) => {
  try {
    const { qrToken, date } = req.body;
    if (!qrToken) return res.status(400).json({ error: "qrToken required" });

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const student = await StudentProfile.findOne({ qrToken }).populate(
      "userId"
    );
    if (!student) return res.status(404).json({ error: "Invalid QR code" });

    const studentInfo = {
      name: student.userId.name,
      rollNumber: student.rollNumber,
      department: student.department,
      semester: student.semester,
      section: student.section,
    };

    // Check if already marked today
    const existing = await AttendanceRecord.findOne({
      studentId: student._id,
      date: attendanceDate,
    });
    if (existing)
      return res.status(409).json({
        error: "Attendance already marked for today",
        student: studentInfo,
      });

    const record = await AttendanceRecord.create({
      studentId: student._id,
      date: attendanceDate,
      status: "present",
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      student: studentInfo,
    });
  } catch (err) {
    next(err);
  }
});

// Get today's attendance
// Return today's attendance (lean view for UI table)
router.get("/attendance/today", async (req, res, next) => {
  try {
    const { date } = req.query;
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const records = await AttendanceRecord.find({ date: attendanceDate })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "name" },
      })
      .lean();

    const formatted = records.map((r) => ({
      id: r._id,
      name: r.studentId?.userId?.name,
      rollNumber: r.studentId?.rollNumber,
      department: r.studentId?.department,
      section: r.studentId?.section,
      status: r.status,
      markedAt: r.markedAt,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

// Removed unused teacher/subject endpoints for production hardening.
// If you need them later, restore from git history.

export default router;
