import React, { useEffect, useState } from "react";
import { API } from "../../store/auth.js";

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [pwMessage, setPwMessage] = useState("");

  const loadAttendance = async () => {
    try {
      setError("");
      setLoading(true);
      let url = "/student/attendance";
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length) url += "?" + params.join("&");

      const { data } = await API.get(url);
      setAttendance(data);
    } catch (err) {
      console.error("Failed to load attendance:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to load attendance data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const changePassword = async () => {
    try {
      setPwMessage("");
      if (!pwForm.currentPassword || !pwForm.newPassword) {
        setPwMessage("Please fill both password fields");
        return;
      }
      const { data } = await API.post("/student/change-password", pwForm);
      setPwMessage(data.message || "Password updated successfully");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPwMessage(err.response?.data?.error || "Failed to update password");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md w-full">
          <h3 className="text-red-800 font-semibold mb-2 text-sm sm:text-base">
            Error Loading Attendance
          </h3>
          <p className="text-red-600 text-xs sm:text-sm mb-4">{error}</p>
          <button
            onClick={loadAttendance}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
            Retry
          </button>
        </div>
      </div>
    );

  if (!attendance) return null;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-3">My Profile</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="password"
            className="border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base"
            placeholder="Current Password"
            value={pwForm.currentPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, currentPassword: e.target.value })
            }
          />
          <input
            type="password"
            className="border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base"
            placeholder="New Password"
            value={pwForm.newPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, newPassword: e.target.value })
            }
          />
        </div>
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 sm:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            onClick={changePassword}>
            Change Password
          </button>
          {pwMessage && (
            <span className="text-sm sm:text-base text-gray-700">
              {pwMessage}
            </span>
          )}
        </div>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          My Attendance Summary
        </h2>

        <div
          className={`p-4 sm:p-6 rounded-lg ${
            attendance.percentage >= 75 ? "bg-green-100" : "bg-red-100"
          }`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div className="bg-white/50 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                {attendance.totalDays}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                Total Days
              </div>
            </div>
            <div className="bg-white/50 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                {attendance.presentDays}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                Present
              </div>
            </div>
            <div className="bg-white/50 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-red-600">
                {attendance.absentDays}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                Absent
              </div>
            </div>
            <div className="bg-white/50 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {attendance.percentage}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                Percentage
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          Attendance History
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="date"
            className="flex-1 border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <input
            type="date"
            className="flex-1 border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
          <button
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
            onClick={loadAttendance}>
            Filter
          </button>
          <button
            className="bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base font-medium"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setTimeout(loadAttendance, 100);
            }}>
            Clear
          </button>
        </div>

        {attendance.records.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base py-4 text-center">
            No attendance records
          </p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-auto max-h-96">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left p-2 sm:p-3">Date</th>
                      <th className="text-left p-2 sm:p-3">Status</th>
                      <th className="text-left p-2 sm:p-3">Marked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.records.map((r, i) => (
                      <tr
                        key={i}
                        className="border-t hover:bg-gray-50 transition-colors">
                        <td className="p-2 sm:p-3 font-medium">
                          {new Date(r.date).toLocaleDateString()}
                        </td>
                        <td className="p-2 sm:p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              r.status === "present"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 text-xs text-gray-600">
                          {new Date(r.markedAt).toLocaleString()}
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
    </div>
  );
}
