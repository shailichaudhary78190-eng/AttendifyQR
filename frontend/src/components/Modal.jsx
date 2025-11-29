import React from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  type = "info",
}) {
  if (!isOpen) return null;

  const colors = {
    success: "bg-green-100 border-green-500 text-green-900",
    error: "bg-red-100 border-red-500 text-red-900",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-900",
    info: "bg-blue-100 border-blue-500 text-blue-900",
  };

  const icons = {
    success: (
      <svg
        className="w-16 h-16 mx-auto text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-16 h-16 mx-auto text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-16 h-16 mx-auto text-yellow-600"
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
    ),
    info: (
      <svg
        className="w-16 h-16 mx-auto text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
        <div className={`${colors[type]} border-l-4 rounded-t-xl p-6`}>
          {icons[type]}
          <h3 className="text-2xl font-bold text-center mt-4">{title}</h3>
        </div>
        <div className="p-6 text-center">{children}</div>
        <div className="p-4 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
