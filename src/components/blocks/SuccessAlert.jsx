import React from "react";

function SuccessAlert({ message }) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-sm z-50 animate-fade-in-down">
      <div className="bg-green-50 border-l-6 border-green-500 rounded-lg py-3 px-4 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center gap-3">
        {/* Success Check Icon */}
        <svg
          className="w-6 h-6 text-green-600 shrink-0 animate-scale-in"
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
        <p className="text-green-800 font-semibold text-base tracking-tight">
          {message}
        </p>
      </div>
    </div>
  );
}

export default SuccessAlert;
