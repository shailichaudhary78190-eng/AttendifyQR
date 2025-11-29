import React, { useEffect, useState } from "react";
import { API } from "../../store/auth.js";
import ScannerTab from "./ScannerTab.jsx";

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

  return (
    <div>
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setTab("students")}
            className={`px-4 py-2 font-medium ${
              tab === "students"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}>
            Students
          </button>
          <button
            onClick={() => setTab("scanner")}
            className={`px-4 py-2 font-medium ${
              tab === "scanner"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}>
            Mark Attendance
          </button>
          <button
            onClick={() => {
              setTab("attendance");
              loadAttendance();
            }}
            className={`px-4 py-2 font-medium ${
              tab === "attendance"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}>
            Today's Attendance
          </button>
        </div>
      </div>

      {tab === "students" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Add Student</h2>

            {message.text && (
              <div
                className={`mb-4 p-3 rounded ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                {message.text}
              </div>
            )}

            <form className="space-y-2" onSubmit={addStudent}>
              <input
                className="w-full border p-2 rounded"
                type="email"
                placeholder="Email *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Full Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Roll Number *"
                required
                value={form.rollNumber}
                onChange={(e) =>
                  setForm({ ...form, rollNumber: e.target.value })
                }
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Department (e.g., MCA) *"
                required
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Semester (e.g., 3rd) *"
                required
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Section (e.g., A) *"
                required
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Photo URL (optional)"
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
              />
              <button className="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 font-medium">
                Add Student
              </button>
            </form>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Students ({students.length})</h2>
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2">Roll</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Dept</th>
                    <th className="text-left p-2">Sem</th>
                    <th className="text-left p-2">Sec</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{s.rollNumber}</td>
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">{s.department}</td>
                      <td className="p-2">{s.semester}</td>
                      <td className="p-2">{s.section}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => openIdCard(s.id)}>
                          ID Card
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {idCard && (
            <div className="md:col-span-2 bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-3">ID Card</h2>
              <div className="flex gap-6 items-start">
                <img
                  src={idCard.student.photo || ""}
                  alt="photo"
                  className="w-24 h-24 object-cover bg-gray-200 rounded"
                />
                <div className="flex-1">
                  <div className="mb-1">
                    <strong>Name:</strong> {idCard.student.name}
                  </div>
                  <div className="mb-1">
                    <strong>Roll:</strong> {idCard.student.rollNumber}
                  </div>
                  <div className="mb-1">
                    <strong>Dept:</strong> {idCard.student.department} |
                    <strong> Sem:</strong> {idCard.student.semester} |
                    <strong> Sec:</strong> {idCard.student.section}
                  </div>
                </div>
                <img src={idCard.qr} alt="QR" className="w-32 h-32" />
              </div>
              <button
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = idCard.qr;
                  a.download = `ID-${idCard.student.rollNumber}.png`;
                  a.click();
                }}>
                Download PNG
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "scanner" && <ScannerTab onComplete={loadAttendance} />}

      {tab === "attendance" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">
            Today's Attendance ({new Date().toLocaleDateString()})
          </h2>
          {attendance.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">
              No attendance marked today
            </p>
          ) : (
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2">Roll Number</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Department</th>
                    <th className="text-left p-2">Section</th>
                    <th className="text-left p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((r, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-2">{r.rollNumber}</td>
                      <td className="p-2">{r.name}</td>
                      <td className="p-2">{r.department}</td>
                      <td className="p-2">{r.section}</td>
                      <td className="p-2 text-xs text-gray-600">
                        {new Date(r.markedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
