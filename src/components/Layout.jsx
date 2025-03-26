import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";

const Layout = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.userData);

  const navigate = useNavigate();

  // Determine active route based on pathname
  const getActiveRoute = () => {
    if (location.pathname === "/") return "Home";
    if (location.pathname.startsWith("/achievements")) return "Achievements";
    if (location.pathname.startsWith("/opportunities")) return "Opportunities";
    if (location.pathname.startsWith("/alumni-map")) return "Alumni Map";
    if (location.pathname.startsWith("/profile")) return "Profile";
    return "";
  };

  useEffect(() => {
    if (!user) navigate("/login");
    if (user && user?.userVerificationStatus !== "verified")
      navigate("/pending-user");
  }, [user]);

  return (
    <div className="flex flex-col h-[100vh] gap-2 relative overflow-auto p-2">
      <Navbar />
      <div className="flex flex-col-reverse gap-2 md:flex md:flex-row">
        {user && user?.userVerificationStatus == "verified" && (
          <LeftSidebar active={getActiveRoute()} />
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
