import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../store/authSlice";
import userAuth from "../firebase/firebaseAuth";

import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";

const Layout = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.userData);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    const unsubscribe = userAuth.auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await userAuth.getCurrentUserData();

          if (!userData) {
            console.error("User data not found");
            navigate("/login");
            return;
          }

          const updatedUserData = {
            ...userData,
            uid: user.uid,
          };
          delete updatedUserData.createdAt;

          dispatch(
            login({
              userData: updatedUserData,
            })
          );
        } catch (error) {
          console.error("Error fetching user data:", error);
          navigate("/login");
        }
      } else {
        dispatch(logout());
        navigate("/login");
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch, navigate]);

  useEffect(() => {
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
