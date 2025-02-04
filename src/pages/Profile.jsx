import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { login, logout } from "../store/authSlice";
import { Loader } from "../components";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const unsubscribe = userAuth.auth.onAuthStateChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userData = await dbServices.getDocument(
              "users",
              firebaseUser.uid
            );
            dispatch(login({ userData }));
          } catch (error) {
            console.error("Error fetching user data:", error);
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      }
    );

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
    return <Loader />;
  }

  return (
    <div className="flex flex-col lg:h-screen md:h-auto bg-black overflow-auto scrollbar-hide">
      {/* Banner Section */}
      <div className="flex h-[35%] bg-gray-800 overflow-hidden">
        <img
          src="cover.png"
          className="w-full h-full object-cover opacity-40"
          alt="Banner"
        />
      </div>

      {/* Profile Content */}
      <div className="flex flex-col lg:h-[65%] md:h-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row relative justify-end lg:items-center md:items-start h-auto md:h-[40%] lg:h-[40%] bg-gray-800 shadow-2xl p-4 md:p-6 ">
          {/* Profile Avatar */}
          <div className="absolute rounded-full h-33 w-33 md:h-[280px] md:w-[280px] -top-28  md:-top-36 left-1/2 md:left-20 transform -translate-x-1/2 md:translate-x-0 shadow-xl z-[1]">
            <img
              src="/avatar.png"
              className="rounded-full w-full h-full object-cover"
              alt="Profile"
            />
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row w-full md:w-[65%] justify-between items-center md:items-start p-2 rounded-tl-xl mt-14 md:mt-0">
            <div className="w-full md:w-[70%] text-center md:text-left space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
                {userData.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="px-4 py-1 bg-blue-900 text-gray-100 rounded-full">
                  {userData?.userRole || "User"}
                </span>
                <button className="px-4 py-1 bg-blue-600 text-gray-100 rounded-full hover:bg-blue-500 transition">
                  Connect+
                </button>
              </div>

              <div className="flex gap-5 text-gray-400 justify-center md:justify-start items-center pl-2">
                <a
                  href={userData?.linkedin || "https://in.linkedin.com/"}
                  className="hover:text-blue-400"
                >
                  <img src="/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
                </a>
                <a
                  href={
                    `https://mail.google.com/mail/?view=cm&fs=1&to=${userData?.email}&su=Hello%20there&body=Hi%20there,%20I%20wanted%20to%20reach%20out%20about%20...` ||
                    "#"
                  }
                  className="hover:text-blue-400"
                >
                  <img src="/gmail.svg" alt="Email" className="w-6 h-6" />
                </a>
                <a
                  href={userData?.twitter || "https://x.com/home?lang=en"}
                  className="hover:text-blue-400"
                >
                  <img src="/twitter.svg" alt="Twitter" className="w-6 h-6" />
                </a>
              </div>
            </div>

            <button className="w-full md:w-[30%] h-fit px-6 py-2 bg-[#181818] border border-gray-600 text-gray-100 rounded-full hover:bg-gray-600 transition mt-4 md:mt-0">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-gray-900 p-4 flex flex-col justify-evenly shadow-2xl h-[60%]">
          <div className="py-2 flex flex-col justify-evenly overflow-auto scrollbar-hide">
            <div className="flex flex-col md:flex-row justify-around text-gray-100 text-center md:text-left space-y-4 md:space-y-0 p-2">
              <div className="space-y-2">
                <div>
                  <label className="text-gray-400 text-sm">Education</label>
                  <p className="font-medium">
                    {userData?.education || "Not Specified"}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Location</label>
                  <p className="font-medium">
                    {userData?.location || "Not Specified"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">
                  Current Position
                </label>
                <p className="font-medium">
                  {userData?.position || "not specified"}
                </p>
              </div>
            </div>

            <div className="space-y-2 px-4 md:pl-10">
              <h2 className="text-xl font-semibold text-gray-100">About</h2>
              <div className="overflow-auto scrollbar-hide p-2">
                <p className="text-gray-400 max-h-[40vh] leading-relaxed">
                  {userData?.about ||
                    "User has not provided any information about themselves"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
