import React from "react";

function ErrorAlert({message}) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-md z-50">
      <div className="bg-red-50 border-l-4 border-red-400 rounded-lg py-1 px-2 shadow-md">
        <div className="flex items-center justify-center gap-3">
          <svg
            className="w-5 h-5 text-red-400 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-red-700 font-medium text-sm text-center">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorAlert;
