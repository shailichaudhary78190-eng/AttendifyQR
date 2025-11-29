import React, { useEffect, useState } from "react";
import { API } from "../../store/auth.js";
import { QrReader } from "react-qr-reader";

export default function ScannerTab({ onComplete }) {
  const [list, setList] = useState([]);
  const [status, setStatus] = useState("Initializing camera...");
  const [cameraError, setCameraError] = useState(null);
  const [lastScanned, setLastScanned] = useState(null);

  const loadToday = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await API.get(`/admin/attendance/today?date=${today}`);
      setList(data);
    } catch (err) {
      console.error("Failed to load attendance:", err);
    }
  };

  useEffect(() => {
    loadToday();
  }, []);

  const handleScan = async (qrToken) => {
    if (!qrToken || qrToken === lastScanned) return;
    setLastScanned(qrToken);
    setStatus("Processing...");

    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await API.post("/admin/mark-attendance", {
        qrToken,
        date: today,
      });
      setStatus(`✓ ${data.message || "Marked present"}`);
      await loadToday();
      if (onComplete) onComplete();

      // Clear status after 3 seconds
      setTimeout(() => {
        setStatus("Ready to scan");
        setLastScanned(null);
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error marking attendance";
      setStatus(`✗ ${errorMsg}`);
      setTimeout(() => {
        setStatus("Ready to scan");
        setLastScanned(null);
      }, 3000);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">QR Scanner</h2>

        {cameraError ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <p className="text-red-800 font-semibold mb-2">Camera Error</p>
            <p className="text-sm text-red-600">{cameraError}</p>
            <p className="text-xs text-gray-600 mt-2">
              Please ensure camera permissions are granted and a camera is
              connected.
            </p>
          </div>
        ) : (
          <div className="relative">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result, error) => {
                if (!!result) {
                  handleScan(result?.text);
                  setStatus("QR detected");
                }
                if (!!error && error.name === "NotAllowedError") {
                  setCameraError(
                    "Camera permission denied. Please allow camera access and reload."
                  );
                } else if (!!error && error.name === "NotFoundError") {
                  setCameraError("No camera found on this device.");
                } else if (!!error && !cameraError) {
                  // Generic camera initialization - don't spam errors
                  setStatus("Initializing camera...");
                }
              }}
              style={{ width: "100%" }}
              videoStyle={{ borderRadius: "0.5rem" }}
            />
          </div>
        )}

        <div
          className={`mt-3 p-2 rounded text-center font-medium ${
            status.startsWith("✓")
              ? "bg-green-50 text-green-700"
              : status.startsWith("✗")
              ? "bg-red-50 text-red-700"
              : "bg-blue-50 text-blue-700"
          }`}>
          {status}
        </div>

        <div className="mt-3 text-xs text-gray-500">
          <p>• Position the QR code within the camera frame</p>
          <p>• Ensure good lighting for best results</p>
          <p>• QR will auto-scan when detected</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Present List ({list.length})</h2>
        {list.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No attendance marked yet</p>
        ) : (
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Roll</th>
                  <th className="text-left p-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.rollNumber}</td>
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
    </div>
  );
}
