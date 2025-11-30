import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import AttendanceRecord from "../models/AttendanceRecord.js";
import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";

const router = express.Router();

router.get(
  "/attendance",
  authenticate,
  authorize("student"),
  async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const student = await StudentProfile.findOne({ userId: req.user.id });
      if (!student)
        return res.status(404).json({ error: "Student profile not found" });

      const filter = { studentId: student._id };
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      const records = await AttendanceRecord.find(filter).lean();

      const totalDays = records.length;
      const presentDays = records.filter((r) => r.status === "present").length;
      const percentage = totalDays
        ? Math.round((presentDays / totalDays) * 100)
        : 0;

      res.json({
        totalDays,
        presentDays,
        absentDays: totalDays - presentDays,
        percentage,
        records: records.map((r) => ({
          date: r.date,
          status: r.status,
          markedAt: r.markedAt,
        })),
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

// Change password for logged-in student
router.post(
  "/change-password",
  authenticate,
  authorize("student"),
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Both current and new password are required" });
      }

      const user = await User.findById(req.user.id).select("password");
      if (!user) return res.status(404).json({ error: "User not found" });

      const bcrypt = await import("bcryptjs");
      const ok = await bcrypt.default.compare(currentPassword, user.password);
      if (!ok)
        return res.status(401).json({ error: "Current password is incorrect" });

      const hashed = await bcrypt.default.hash(newPassword, 10);
      user.password = hashed;
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }
);
