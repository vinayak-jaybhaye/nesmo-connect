import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import { logout } from "../store/authSlice";

function Navbar({ isUnreadNotification, onNotificationsToggle }) {
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
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <span className="text-lg font-semibold text-gray-100 hidden md:inline-block">
          NESMO Connect
        </span>
      </div>

      {/* Right Section - Navigation Items */}
      <div className="flex items-center space-x-4">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 bg-gray-700/50 hover:bg-gray-600/60 rounded-xl px-8 py-1.5 transition-all duration-200 text-sm hover:ring-1 hover:ring-gray-500"
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
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            className="p-2 hover:bg-gray-700/50 rounded-full size-12 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onNotificationsToggle();
            }}
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
          <div className="absolute -bottom-8 right-0 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            View Profile
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
