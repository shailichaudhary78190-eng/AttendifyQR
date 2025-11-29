import React, { useEffect, useState } from "react";
import { API } from "../../store/auth.js";

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">
            Error Loading Attendance
          </h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={loadAttendance}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    );

  if (!attendance) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">My Attendance Summary</h2>

        <div
          className={`p-6 rounded-lg ${
            attendance.percentage >= 75 ? "bg-green-100" : "bg-red-100"
          }`}>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold">{attendance.totalDays}</div>
              <div className="text-sm text-gray-600">Total Days</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {attendance.presentDays}
              </div>
              <div className="text-sm text-gray-600">Present</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">
                {attendance.absentDays}
              </div>
              <div className="text-sm text-gray-600">Absent</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{attendance.percentage}%</div>
              <div className="text-sm text-gray-600">Percentage</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Attendance History</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={loadAttendance}>
            Filter
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setTimeout(loadAttendance, 100);
            }}>
            Clear
          </button>
        </div>

        {attendance.records.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No attendance records</p>
        ) : (
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Marked At</th>
                </tr>
              </thead>
              <tbody>
                {attendance.records.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-2">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          r.status === "present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2 text-xs text-gray-600">
                      {new Date(r.markedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
