import React, { useEffect, useState } from "react";
import { API } from "../../store/auth.js";
const ScannerTab = React.lazy(() => import("./ScannerTab.jsx"));

export default function AdminDashboard() {
  const [tab, setTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({
    email: "",
    name: "",
    rollNumber: "",
    department: "",
    semester: "",
    section: "",
    photo: "",
  });
  const [idCard, setIdCard] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const load = async () => {
    try {
      const { data } = await API.get("/admin/students");
      setStudents(data);
    } catch {}
  };

  const loadAttendance = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await API.get(`/admin/attendance/today?date=${today}`);
      setAttendance(data);
    } catch (err) {
      console.error("Failed to load attendance:", err);
    }
  };

  useEffect(() => {
    load();
    loadAttendance();
  }, []);

  const addStudent = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (
      !form.email ||
      !form.name ||
      !form.rollNumber ||
      !form.department ||
      !form.semester ||
      !form.section
    ) {
      setMessage({ type: "error", text: "Please fill all required fields" });
      return;
    }

    try {
      const { data } = await API.post("/admin/students", form);
      setMessage({
        type: "success",
        text: `${data.message}. Default password: ${data.defaultPassword}`,
      });
      setForm({
        email: "",
        name: "",
        rollNumber: "",
        department: "",
        semester: "",
        section: "",
        photo: "",
      });
      await load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Error creating student",
      });
    }
  };

  const openIdCard = async (id) => {
    const { data } = await API.get(`/admin/students/${id}/id-card`);
    setIdCard(data);
  };

  const downloadIdCard = () => {
    // Create a canvas to combine student details with QR code
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size for ID card (larger for better quality)
    canvas.width = 800;
    canvas.height = 450;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(0, 0, canvas.width, 70);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Student ID Card", canvas.width / 2, 45);

    // Student details
    ctx.fillStyle = "#000000";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Name:", 40, 130);
    ctx.fillText("Roll Number:", 40, 180);
    ctx.fillText("Department:", 40, 230);
    ctx.fillText("Semester:", 40, 280);
    ctx.fillText("Section:", 40, 330);

    ctx.font = "18px Arial";
    ctx.fillStyle = "#333333";
    ctx.fillText(idCard.student.name, 220, 130);
    ctx.fillText(idCard.student.rollNumber, 220, 180);
    ctx.fillText(idCard.student.department, 220, 230);
    ctx.fillText(idCard.student.semester, 220, 280);
    ctx.fillText(idCard.student.section, 220, 330);

    // Load and draw QR code
    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    qrImage.onload = () => {
      // Draw larger QR code on the right side
      ctx.drawImage(qrImage, 520, 100, 240, 240);

      // Footer
      ctx.fillStyle = "#666666";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("AttendifyQR - Scan for Attendance", canvas.width / 2, 410);

      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${idCard.student.name.replace(/\s+/g, "_")}_ID_Card.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    };
    qrImage.src = idCard.qr;
  };
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2 sm:gap-4 border-b overflow-x-auto">
          <button
            onClick={() => setTab("students")}
            className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap text-sm sm:text-base ${
              tab === "students"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}>
            Students
          </button>
          <button
            onClick={() => setTab("scanner")}
            className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap text-sm sm:text-base ${
              tab === "scanner"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}>
            Mark Attendance
          </button>
          <button
            onClick={() => {
              setTab("attendance");
              loadAttendance();
            }}
            className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap text-sm sm:text-base ${
              tab === "attendance"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}>
            Today's Attendance
          </button>
        </div>
      </div>

      {tab === "students" && (
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Add Student
            </h2>

            {message.text && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm sm:text-base ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                {message.text}
              </div>
            )}

            <form className="space-y-2 sm:space-y-3" onSubmit={addStudent}>
              <input
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                type="email"
                placeholder="Email *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                placeholder="Full Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                placeholder="Roll Number *"
                required
                value={form.rollNumber}
                onChange={(e) =>
                  setForm({ ...form, rollNumber: e.target.value })
                }
              />
              <input
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                placeholder="Department (e.g., MCA) *"
                required
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              />
              <input
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                placeholder="Semester (e.g., 3rd) *"
                required
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                placeholder="Section (e.g., A) *"
                required
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                placeholder="Photo URL (optional)"
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
              />
              <button className="w-full bg-green-600 text-white px-3 py-2 sm:py-3 rounded-lg hover:bg-green-700 font-medium text-sm sm:text-base transition-colors shadow-sm">
                Add Student
              </button>
            </form>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Students ({students.length})
            </h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-auto max-h-96">
                  <table className="min-w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left p-2 sm:p-3">Roll</th>
                        <th className="text-left p-2 sm:p-3">Name</th>
                        <th className="text-left p-2 sm:p-3 hidden sm:table-cell">
                          Dept
                        </th>
                        <th className="text-left p-2 sm:p-3 hidden md:table-cell">
                          Sem
                        </th>
                        <th className="text-left p-2 sm:p-3 hidden md:table-cell">
                          Sec
                        </th>
                        <th className="text-left p-2 sm:p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr
                          key={s.id}
                          className="border-t hover:bg-gray-50 transition-colors">
                          <td className="p-2 sm:p-3 font-medium">
                            {s.rollNumber}
                          </td>
                          <td className="p-2 sm:p-3">{s.name}</td>
                          <td className="p-2 sm:p-3 hidden sm:table-cell">
                            {s.department}
                          </td>
                          <td className="p-2 sm:p-3 hidden md:table-cell">
                            {s.semester}
                          </td>
                          <td className="p-2 sm:p-3 hidden md:table-cell">
                            {s.section}
                          </td>
                          <td className="p-2 sm:p-3">
                            <button
                              className="text-blue-600 hover:text-blue-800 hover:underline text-xs sm:text-sm font-medium"
                              onClick={() => openIdCard(s.id)}>
                              QR
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {idCard && (
            <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                ID Card & QR Code
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
                <img
                  src={
                    idCard.student.photo || "https://via.placeholder.com/100"
                  }
                  alt="photo"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-gray-200 rounded-lg border-2 border-gray-300"
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="mb-2 text-sm sm:text-base">
                    <strong>Name:</strong> {idCard.student.name}
                  </div>
                  <div className="mb-2 text-sm sm:text-base">
                    <strong>Roll:</strong> {idCard.student.rollNumber}
                  </div>
                  <div className="mb-2 text-xs sm:text-sm text-gray-600">
                    <strong>Dept:</strong> {idCard.student.department} |
                    <strong> Sem:</strong> {idCard.student.semester} |
                    <strong> Sec:</strong> {idCard.student.section}
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg border-2 border-gray-300 shadow-sm">
                  <img
                    src={idCard.qr}
                    alt="QR"
                    className="w-28 h-28 sm:w-32 sm:h-32"
                  />
                </div>
              </div>
              <button
                className="mt-3 sm:mt-4 w-full sm:w-auto bg-blue-600 text-white px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                onClick={downloadIdCard}>
                Download ID Card
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "scanner" && (
        <React.Suspense
          fallback={<div className="p-4">Loading scanner...</div>}>
          <ScannerTab onComplete={loadAttendance} />
        </React.Suspense>
      )}

      {tab === "attendance" && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            Today's Attendance ({new Date().toLocaleDateString()})
          </h2>
          {attendance.length === 0 ? (
            <p className="text-gray-500 text-sm sm:text-base py-4 text-center">
              No attendance marked today
            </p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-auto max-h-96">
                  <table className="min-w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left p-2 sm:p-3">Roll</th>
                        <th className="text-left p-2 sm:p-3">Name</th>
                        <th className="text-left p-2 sm:p-3 hidden md:table-cell">
                          Department
                        </th>
                        <th className="text-left p-2 sm:p-3 hidden lg:table-cell">
                          Section
                        </th>
                        <th className="text-left p-2 sm:p-3">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((r, i) => (
                        <tr
                          key={i}
                          className="border-t hover:bg-gray-50 transition-colors">
                          <td className="p-2 sm:p-3 font-medium">
                            {r.rollNumber}
                          </td>
                          <td className="p-2 sm:p-3">{r.name}</td>
                          <td className="p-2 sm:p-3 hidden md:table-cell">
                            {r.department}
                          </td>
                          <td className="p-2 sm:p-3 hidden lg:table-cell">
                            {r.section}
                          </td>
                          <td className="p-2 sm:p-3 text-xs text-gray-600">
                            {new Date(r.markedAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
