import React from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Account Registration Disabled
          </h1>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-4">
              Self-registration is not available for this system.
            </p>

            <div className="text-left space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  👨‍🎓 For Students:
                </h3>
                <p className="text-sm text-gray-700">
                  Your account must be created by an administrator. Once
                  created, you can login with:
                </p>
                <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc">
                  <li>Email provided by admin</li>
                  <li>
                    Default password:{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      student123
                    </code>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-green-900 mb-2">
                  👨‍💼 For Admins:
                </h3>
                <p className="text-sm text-gray-700">
                  Admin accounts are created by the system administrator.
                  Contact your IT department for access.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
