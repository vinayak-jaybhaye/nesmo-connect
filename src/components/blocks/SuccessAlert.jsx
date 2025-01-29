import React from "react";

function SuccessAlert({ message }) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-md z-50">
      <div className="bg-green-50 border-l-4 border-green-400 rounded-lg py-2 px-3 shadow-md flex items-center gap-3">
        {/* Success Check Icon */}
        <svg
          className="w-6 h-6 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>

        {/* Success Message */}
        <p className="text-green-700 font-medium text-sm">{message}</p>
      </div>
    </div>
  );
}

export default SuccessAlert;
