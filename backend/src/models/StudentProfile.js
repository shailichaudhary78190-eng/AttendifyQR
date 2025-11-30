import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rollNumber: { type: String, unique: true, required: true },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    section: { type: String, required: true },
    photo: { type: String },
    qrToken: { type: String, unique: true, required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);
