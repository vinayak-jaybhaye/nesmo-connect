import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import { logout } from "../store/authSlice";
import { Notifications } from "./";
import {
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  BarChart2,
  Bell,
} from "lucide-react";
import dbServices from "../firebase/firebaseDb";

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileNotificationRef = useRef(null);

  // Get notification count
  useEffect(() => {
    async function getNotificationCount() {
      setNotificationCount(await dbServices.getNotificationCount(userData.uid));
    }
    if (userData) getNotificationCount();
  }, [userData]);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileNotificationRef.current &&
        mobileNotificationRef.current.contains(event.target)
      )
        return;
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setShowMobileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await userAuth.logout();
      dispatch(logout());
      setShowMobileMenu(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const navigateTo = (path) => {
    setShowMobileMenu(false);
    navigate(path);
  };

  return (
    <div className="bg-gray-800/80 sticky top-0 z-20 shadow-lg py-2 px-4 flex justify-between items-center border-b border-gray-600/50 backdrop-blur-sm">
      {/* Left Section - Brand Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => {
          if (userData && userData?.userVerificationStatus != "verified")
            navigate("/pending-user");
          else if (userData) navigate("/");
          else navigate("/landing");
        }}
      >
        <span className="text-sm lg:text-xl text-white font-semibold uppercase tracking-wider group-hover:text-gray-200 transition-colors">
          NESMO
        </span>
        <span className="text-sm lg:text-xl font-semibold uppercase tracking-wider text-indigo-600 group-hover:text-indigo-500 transition-colors">
          CONNECT
        </span>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden mobile-menu-button p-1 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Toggle mobile menu"
      >
        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Admin Dashboard Button */}
        {userData?.userRole === "admin" && (
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center space-x-1.5 bg-gray-700 hover:bg-gray-600 rounded-xl px-6 py-1.5 transition-all duration-200 text-sm text-gray-200"
            aria-label="Admin Dashboard"
          >
            <BarChart2 className="h-5 w-5" />
            <span>Admin Dashboard</span>
          </button>
        )}

        {/* Authenticated User Options */}
        {userData && userData?.userVerificationStatus != "verified" && (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl px-8 py-1.5 transition-all duration-200 text-sm hover:ring-1 hover:ring-gray-500"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        )}

        {userData ? (
          userData.userVerificationStatus == "verified" && (
            <>
              {/* Notifications Button */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className={`w-full flex items-center text-white mr-4`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <Bell className="w-6 h-6" />{" "}
                      {notificationCount > 0 && (
                        <span className="absolute z-20 -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center">
                          {notificationCount > 9 ? "9+" : notificationCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 z-20 p-1 w-80 md:w-96 transform origin-top-right transition-all duration-200 ease-out">
                    <Notifications
                      onClose={() => setShowNotifications(false)}
                      onNotificationsToggle={() =>
                        setShowNotifications((prev) => !prev)
                      }
                      setNotificationCount={setNotificationCount}
                      userId={userData?.uid}
                    />
                  </div>
                )}
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
                <div className="absolute -bottom-16 right-0 bg-gray-700 px-3 py-1.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  View Profile
                </div>
              </div>
            </>
          )
        ) : (
          <>
            {/* Login Button */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl px-6 py-1.5 transition-all duration-200 text-sm text-white shadow-md"
              aria-label="Login"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>

            {/* Signup Button */}
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-500 rounded-xl px-6 py-1.5 transition-all duration-200 text-sm text-white shadow-md"
              aria-label="Sign up"
            >
              <UserPlus className="h-4 w-4" />
              <span>Signup</span>
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="absolute text-white top-full left-0 right-0 bg-gray-800 shadow-lg border-t border-gray-700 py-2 px-4 md:hidden z-20 animate-in fade-in slide-in-from-top-5 duration-200"
        >
          <div className="flex flex-col space-y-3 py-2">
            {userData?.userRole === "admin" && (
              <button
                onClick={() => navigateTo("/admin-dashboard")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <BarChart2 className="h-5 w-5" />
                <span>Admin Dashboard</span>
              </button>
            )}

            {userData ? (
              <>
                {userData.userVerificationStatus === "verified" && (
                  <>
                    <button
                      onClick={() => navigateTo(`/profile/${userData?.uid}`)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full overflow-hidden">
                        <img
                          src={userData?.avatarUrl || "/avatar.png"}
                          alt="Profile"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        setShowNotifications(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="relative">
                        <Bell className="w-6 h-6" />
                      </div>
                      <span>Notifications</span>
                      {notificationCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-auto">
                          {notificationCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => navigateTo(`/alumni-map`)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full overflow-hidden">
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
                      </div>
                      <span>Alumni Map</span>
                    </button>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo("/login")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => navigateTo("/signup")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition-colors"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Signup</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Notifications Dropdown for Mobile (outside the mobile menu) */}
      {showNotifications && !showMobileMenu && (
        <div
          ref={mobileNotificationRef}
          className="md:hidden absolute top-16 left-4 right-4 md:left-auto md:right-4 z-20 p-1 md:w-96 md:transform-none"
        >
          <Notifications
            onClose={() => setShowNotifications(false)}
            onNotificationsToggle={() => setShowNotifications((prev) => !prev)}
            setNotificationCount={setNotificationCount}
            userId={userData?.uid}
          />
        </div>
      )}
    </div>
  );
}

export default Navbar;
