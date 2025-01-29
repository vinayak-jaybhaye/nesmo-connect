import React from "react";

function loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
      </div>
    </div>
  );
}

export default loader;
