import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Communities } from "../components";

function LeftSidebar({ userData, active = "Home" }) {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const navigate = useNavigate();

  // Navigation items with icons
  const navItems = [
    {
      name: "Home",
      action: () => navigate("/"),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Achievements",
      action: () => navigate("/achievements"),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
    },
    {
      name: "Opportunities",
      action: () => navigate("/opportunities"),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Alumni Map",
      action: () => navigate("/alumni-map"),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`sticky top-16 h-[90vh] rounded-xl bg-gray-800/80 border-r border-gray-700/50 backdrop-blur-md flex flex-col transition-all duration-300 ${
        sidebarHidden ? "w-[60px] min-w-[60px]" : "w-[25%] min-w-[200px]"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarHidden(!sidebarHidden)}
        className="p-3 hover:bg-gray-700/50 transition-colors duration-200 flex items-center justify-center"
      >
        {sidebarHidden ? (
          <svg
            className="w-5 h-5"
            fill="white"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="white"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        )}
      </button>

      {!sidebarHidden ? (
        <div className="flex flex-col justify-between h-full space-y-4 px-2 pb-8">
          {/* Navigation Menu */}
          <div className="flex flex-col gap-2">
            <div className="space-y-2 overflow-scroll scrollbar-hide bg-gray-900 p-2 rounded-lg shadow-lg border border-black">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  onClick={item.action}
                  className={`p-2.5 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-all duration-200 text-gray-300 hover:text-gray-100 flex items-center gap-2 ${
                    active === item.name ? "bg-gray-700/50" : ""
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Communities Section */}
            <Communities />
          </div>

          {/* Footer */}
          <div className="mt-auto space-y-1 text-center text-gray-400 text-xs">
            <p>
              &copy; {new Date().getFullYear()} Nesmo Connect. All rights
              reserved.
            </p>
            <p>
              <span
                onClick={() => navigate("/about")}
                className="hover:underline hover:text-gray-200 cursor-pointer"
              >
                About Us
              </span>{" "}
              •{" "}
              <span
                onClick={() => navigate("#")}
                className="hover:underline hover:text-gray-200 cursor-pointer"
              >
                Terms
              </span>{" "}
              •{" "}
              <span
                onClick={() => navigate("#")}
                className="hover:underline hover:text-gray-200 cursor-pointer"
              >
                Privacy
              </span>
            </p>
          </div>
        </div>
      ) : (
        /* Collapsed Navigation */
        <div className="flex flex-col items-center space-y-4 px-2 pt-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className={`p-2.5 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-all duration-200 text-gray-300 hover:text-gray-100 ${
                active === item.name ? "bg-gray-700/50" : ""
              }`}
              title={item.name}
            >
              {item.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeftSidebar;
