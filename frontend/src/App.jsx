import React from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import { useAuthStore } from "./store/auth.js";

const Protected = ({ roles, children }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role))
    return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const { user, logout } = useAuthStore();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {user && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h1 className="text-lg font-semibold text-gray-800">
                        AttendifyQR
                      </h1>
                      <p className="text-xs text-gray-500">
                        Student Management Portal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <nav className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role === "admin"
                        ? "👨‍💼 Administrator"
                        : "👨‍🎓 Student"}
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </header>
      )}

      <main
        className={
          user
            ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow"
            : "flex-grow"
        }>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={user.role === "admin" ? "/admin" : "/student"}
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              <Protected roles={["admin"]}>
                <AdminDashboard />
              </Protected>
            }
          />
          <Route
            path="/student"
            element={
              <Protected roles={["student"]}>
                <StudentDashboard />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {user && (
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">AttendifyQR</span>{" "}
                - Student Attendance Management System
              </p>
              <p className="text-xs text-gray-500">
                Made with <span className="text-red-500">❤️</span> by{" "}
                <span className="font-semibold text-gray-700">
                  Shaili & Bhawana
                </span>
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
