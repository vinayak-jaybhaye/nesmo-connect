import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { login, logout } from "../store/authSlice";
import { Loader } from "../components";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const unsubscribe = userAuth.auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await dbServices.getDocument("users", firebaseUser.uid);
          dispatch(login({ userData }));
        } catch (error) {
          console.error("Error fetching user data:", error);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleLogout = async () => {
    try {
      await userAuth.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  if (!userData) {
    return <Loader/>
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-800 text-white p-5">
          <h2 className="text-xl font-semibold">
            Welcome, {userData?.name || "User"}!
          </h2>
          <ul className="mt-4 space-y-3">
            <li className="cursor-pointer p-2 bg-gray-700 rounded hover:bg-gray-600">
              Profile
            </li>
            <li className="cursor-pointer p-2 bg-gray-700 rounded hover:bg-gray-600">
              Settings
            </li>
            <li className="cursor-pointer p-2 bg-gray-700 rounded hover:bg-gray-600">
              Messages
            </li>
          </ul>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold">Dashboard Overview</h2>
          <p className="mt-4 text-gray-700">
            This is your dashboard where you can access different features.
          </p>
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">User Information</h3>
            <p>
              <strong>Name:</strong> {userData?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {userData?.email || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {userData?.userRole || "N/A"}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;