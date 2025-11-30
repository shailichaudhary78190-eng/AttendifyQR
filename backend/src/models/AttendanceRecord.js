import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent"], default: "present" },
    markedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

attendanceRecordSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.model("AttendanceRecord", attendanceRecordSchema);
