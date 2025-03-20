import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";

const Layout = () => {
  const location = useLocation();

  // Determine active route based on pathname
  const getActiveRoute = () => {
    if (location.pathname === "/") return "Home";
    if (location.pathname.startsWith("/achievements")) return "Achievements";
    if (location.pathname.startsWith("/opportunities")) return "Opportunities";
    if (location.pathname.startsWith("/alumni-map")) return "Alumni Map";
    return "";
  };

  return (
    <div className="flex flex-col h-[100vh] gap-2 relative overflow-auto p-2">
      <Navbar />
      <div className="flex gap-2">
        {true && <LeftSidebar active={getActiveRoute()} />}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
