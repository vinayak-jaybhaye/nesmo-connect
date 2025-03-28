"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Communities } from "../components";
import { useSelector } from "react-redux";
import {
  Home,
  User,
  Award,
  Briefcase,
  MessageSquare,
  Map,
  ChevronLeft,
  ChevronRight,
  Info,
  FileText,
  Shield,
  Bell,
} from "lucide-react";

function LeftSidebar({ userData, active = "Home" }) {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.userData);

  // Determine active page based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActivePage("Home");
    else if (path.includes("/profile")) setActivePage("Profile");
    else if (path.includes("/achievements")) setActivePage("Achievements");
    else if (path.includes("/opportunities")) setActivePage("Opportunities");
    else if (path.includes("/chats")) setActivePage("Chats");
    else if (path.includes("/alumni-map")) setActivePage("Alumni Map");
  }, [location]);

  // Track window size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on smaller screens
      if (window.innerWidth < 1024 && !sidebarHidden) {
        setSidebarHidden(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarHidden]);

  const [activePage, setActivePage] = useState(active);

  const navItems = [
    {
      name: "Home",
      action: () => navigate("/"),
      icon: <Home className="w-5 h-5" />,
      description: "View your feed",
    },
    {
      name: "Achievements",
      action: () => navigate("/achievements"),
      icon: <Award className="w-5 h-5" />,
      description: "Your accomplishments",
    },
    {
      name: "Opportunities",
      action: () => navigate("/opportunities"),
      icon: <Briefcase className="w-5 h-5" />,
      description: "Find new opportunities",
    },
    {
      name: "Profile",
      action: () => navigate(`/profile/${user?.uid}`),
      icon: user?.avatarUrl ? (
        <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-gray-600">
          <img
            src={user.avatarUrl || "/placeholder.svg"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <User className="w-5 h-5" />
      ),
      description: "View your profile",
    },
    {
      name: "Chats",
      action: () => navigate("/chats"),
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Message your connections",
    },
    {
      name: "Alumni Map",
      action: () => navigate("/alumni-map"),
      icon: <Map className="w-5 h-5" />,
      description: "Find alumni worldwide",
    },
    {
      name: "Notifications",
      action: () => navigate("/notifications"),
      icon: <Bell className="w-5 h-5" />,
      description: "View your notifications",
      badge: 3, // Example badge count
    },
  ];

  // Customize mobile navigation items (limit to 5 for better spacing)
  const navItemsMobile = [
    navItems[0], // Home
    navItems[1], // Achievements
    navItems[2], // Opportunities
    navItems[4], // Chats
    navItems[3], // Profile
  ];

  const handleNavigation = (item) => {
    setActivePage(item.name);
    item.action();
  };

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="fixed md:hidden h-16 bottom-0 left-0 right-0 z-20 bg-gray-900/95 border-t border-gray-700/50 backdrop-blur-md shadow-lg">
        <div className="flex items-center h-full justify-around px-1">
          {navItemsMobile.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200
                ${
                  activePage === item.name
                    ? "bg-gradient-to-br from-indigo-600/80 to-indigo-800/80 text-white"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
                }`}
              aria-label={item.name}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spacer for mobile to prevent content from being hidden behind the bottom bar */}
      <div className="md:hidden h-16"></div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex mr-2 flex-col sticky left-0 top-[4rem] h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out
          ${sidebarHidden ? "w-[4.5rem]" : "w-64"}
          bg-gray-900/95 border-r border-gray-700/50 backdrop-blur-md shadow-xl z-10`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarHidden(!sidebarHidden)}
          className="absolute -right-3 top-6 bg-gray-800 p-1.5 rounded-full border border-gray-700 shadow-lg hover:bg-gray-700 transition-colors z-20"
          aria-label={sidebarHidden ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarHidden ? (
            <ChevronRight className="w-4 h-4 text-gray-300" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          )}
        </button>

        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {/* Sidebar Content */}
          <div
            className={`flex flex-col h-full py-4 ${
              sidebarHidden ? "px-2" : "px-3"
            }`}
          >
            {/* Navigation Menu */}
            <nav className="flex-1">
              <div className={`space-y-1 ${sidebarHidden ? "" : "pr-2"}`}>
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center ${
                      sidebarHidden ? "justify-center" : "justify-between"
                    } 
                      rounded-xl p-2.5 transition-all duration-200 group relative
                      ${
                        activePage === item.name
                          ? "bg-gradient-to-r from-indigo-600/80 to-indigo-800/80 text-white shadow-md"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                      }`}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        {item.icon}
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center">
                            {item.badge > 9 ? "9+" : item.badge}
                          </span>
                        )}
                      </div>
                      {!sidebarHidden && (
                        <span className="ml-3 text-sm font-medium">
                          {item.name}
                        </span>
                      )}
                    </div>

                    {/* Right arrow for active item when expanded */}
                    {!sidebarHidden && activePage === item.name && (
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    )}

                    {/* Tooltip for collapsed state */}
                    {sidebarHidden && (
                      <div className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-medium transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-20">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-gray-400 text-[10px]">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* Communities Section - only visible when expanded */}
            {!sidebarHidden && (
              <div className="mt-6 mb-4">
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Communities
                </h3>
                <div className="mt-2">
                  <Communities />
                </div>
              </div>
            )}

            {/* Footer - only visible when expanded */}
            {!sidebarHidden && (
              <div className="mt-auto mb-4 py-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between px-3 text-xs text-gray-400">
                  <button
                    onClick={() => navigate("/about")}
                    className="hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>About</span>
                  </button>
                  <button
                    onClick={() => navigate("/terms")}
                    className="hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Terms</span>
                  </button>
                  <button
                    onClick={() => navigate("/privacy")}
                    className="hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Privacy</span>
                  </button>
                </div>
                <p className="mt-2 text-center text-xs text-gray-500">
                  &copy; {new Date().getFullYear()} NESMO Connect
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftSidebar;
