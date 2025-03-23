import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Communities } from "../components";
import { useSelector } from "react-redux";

function LeftSidebar({ userData, active = "Home" }) {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);

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
      name: "Profile",
      action: () => navigate(`/profile/${user?.uid}`),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
          />
        </svg>
      ),
    },
    {
      name: "Chats",
      action: () => navigate("/chats"),
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
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

  const navItemsMobile = [
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
      name: "Chats",
      action: () => navigate("/chats"),
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      name: "Profile",
      action: () => navigate(`/profile/${user?.uid}`),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
          />
        </svg>
      ),
    },
    // {
    //   name: "Alumni Map",
    //   action: () => navigate("/alumni-map"),
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    //       />
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    //       />
    //     </svg>
    //   ),
    // },
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="fixed md:hidden md:h-[90vh] bottom-0 left-0 right-0 z-10 bg-gray-800/80 border-t border-gray-700/50 backdrop-blur-md">
        <div className="flex items-center p-2 justify-evenly">
          {navItemsMobile.map((item) => (
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
      </div>
      <div className="md:hidden h-16"></div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex sticky left-0 top-0 h-full transition-all duration-300 ${
          sidebarHidden ? "w-20" : "w-64"
        } bg-gray-800/80 border-r border-gray-700/50 backdrop-blur-md`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
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
                <div className="space-y-2 bg-gray-900 p-2 rounded-lg shadow-lg border border-black">
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
            /* Collapsed Desktop Navigation */
            <div className="flex flex-col items-center p-2 gap-4">
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
      </div>
    </>
  );
}

export default LeftSidebar;
