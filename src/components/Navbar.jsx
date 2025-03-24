import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import { logout } from "../store/authSlice";
import { Notifications } from "./";

function Navbar({ isUnreadNotification, onNotificationsToggle }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const notificationCount = userData?.notifications?.length || 0;

  const handleLogout = async () => {
    try {
      await userAuth.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="bg-gray-800/80 sticky top-0 z-10 shadow-lg py-2 px-4 flex justify-between items-center  border-b border-gray-600/50 backdrop-blur-sm">
      {/* Left Section - Brand Logo */}
      {/* <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => {
          if (userData) navigate("/");
        }}
      >
        <span className="text-sm md:text-lg font-bold text-gray-100">
          NESMO Connect
        </span>
      </div> */}
      <div className="flex items-center space-x-2"
        onClick={() =>{
          if(userData) navigate("/");
          else navigate("/landing");
        }}
      >
        <span className="text-sm lg:text-xl text-white font-semibold uppercase tracking-wider">
          NESMO
        </span>
        <span className="text-sm lg:text-xl font-semibold uppercase tracking-wider text-indigo-600">
          CONNECT
        </span>
      </div>

      {/* Right Section - Navigation Items */}
      <div className="flex items-center space-x-4">
        {/* Logout Button */}
        {userData ? (
          <>
            {/* <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl  px-8 py-1.5 transition-all duration-200 text-sm hover:ring-1 hover:ring-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button> */}

            {/* Notifications Button */}
            <div className="relative">
              <button
                className="p-2 hover:bg-gray-700/50 rounded-full size-12 transition-all duration-200"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <img
                  src={
                    isUnreadNotification
                      ? "/notification-active.svg"
                      : "/notification.svg"
                  }
                  alt="Notifications"
                  className="w-6 h-6 mx-auto transition-transform hover:scale-110"
                />
                {notificationCount > 0 && (
                  <div className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full ring-1 ring-red-400 animate-pulse"></div>
                )}
              </button>
            </div>

            {/* Profile Button */}
            <div
              className="relative group cursor-pointer"
              onClick={() => navigate(`/profile/${userData?.uid}`)}
            >
              <div className="h-9 w-9 rounded-full ring-2 ring-gray-600/80 hover:ring-green-500 transition-all overflow-hidden">
                <img
                  src={userData?.avatarUrl || "/avatar.png"}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-16 right-0 bg-gray-400 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                View Profile
              </div>
            </div>
          </>
        ) : (
          <>
            <>
              {/* Login Button */}
              <button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl px-6 py-1.5 transition-all duration-200 text-sm text-white shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H3m0 0l4-4m-4 4l4 4m12-4h-3m-4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Login</span>
              </button>

              {/* Signup Button */}
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-500 rounded-xl px-6 py-1.5 transition-all duration-200 text-sm text-white shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline">Signup</span>
              </button>

              {/* About Button */}
              {/* <button
                onClick={() => navigate("/about")}
                className="flex items-center space-x-1.5 bg-gray-700 hover:bg-gray-600 rounded-xl px-6 py-1.5 transition-all duration-200 text-sm text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline">About</span>
              </button> */}
            </>
          </>
        )}
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-20 md:right-4 z-20 p-1 w-80 md:w-96">
          <Notifications
            onClose={() => setShowNotifications(false)}
            onNotificationsToggle={() => setShowNotifications((prev) => !prev)}
          />
        </div>
      )}
    </div>
  );
}

export default Navbar;
