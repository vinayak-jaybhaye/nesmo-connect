import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { login, logout } from "../store/authSlice";
import { AllPosts, Loader } from "../components";
import { setVars } from "../store/varSlice";

import { NewPost } from "../components";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const selectPost = useSelector((state) => state.vars.selectPost || "allPosts");

  const onSelectionChange = (e) => {
    dispatch(setVars({ selectPost: e.target.value }));
  }

  useEffect(() => {
    const unsubscribe = userAuth.auth.onAuthStateChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const user = await dbServices.getDocument(
              "users",
              firebaseUser.uid
            );
            const userData = {
              uid: firebaseUser.uid,
              name: user.name,
              email: user.email,
              userRole: user.userRole,
            };
            dispatch(login({ userData: userData }));
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
    <div className="flex w-full min-h-screen justify-start h-full bg-gray-900 text-gray-100">
      {/* Left Sidebar */}
      <div className="w-[15%] min-w-[200px] bg-gray-800 p-4 border-r border-gray-700">
        <div className="mb-8 text-xl font-bold text-gray-100">
          NESMO connect
        </div>
        <div className="space-y-4">
          <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">
            Home
          </div>
          <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">
            Community
          </div>
          <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">
            Fundraiser
          </div>
          <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">
            Alumni Listing
          </div>
          <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">
            About Us
          </div>
        </div>
        <div className="mt-8 text-sm font-semibold text-gray-400">
          My communities
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-[85%] bg-gray-900">
        {/* Navbar */}
        <div className="bg-gray-800 shadow-sm p-4 flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-100">Home</div>
          <div className="flex items-center space-x-4">
            <div
              onClick={handleLogout}
              className="cursor-pointer bg-gray-700 rounded-xl px-2 py-1 hover:bg-gray-600 flex items-center justify-center"
            >
              Logout
            </div>
            <button className="p-2 hover:bg-gray-700 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div
              className="h-8 w-8 rounded-full ring-2 ring-gray-600 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <img
                src={userData?.avatar || "/avatar.png"}
                alt="profile image"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-around p-4 gap-4">
          {/* Left Column */}
          <div className="w-[60%] space-y-4">
            {/* Create Post */}
            <div className="flex justify-start gap-2 items-center mt-3 w-[70%]">
              {/* My Posts Option */}
              <div
                className={`cursor-pointer flex justify-evenly items-center ${
                  selectPost === "myPosts" ? "bg-gray-500" : "bg-gray-700"
                } py-1 px-2 rounded-3xl transition-colors text-sm text-white`}
              >
                <input
                  type="radio"
                  name="selectPost"
                  className="hidden peer"
                  id="myPosts"
                  value="myPosts"
                  onChange={(e) => onSelectionChange(e)}
                  checked={selectPost === "myPosts"}
                />
                <label
                  htmlFor="myPosts"
                  className="cursor-pointer text-center w-full"
                >
                  My Posts
                </label>
              </div>

              {/* All Posts Option */}
              <div
                className={`cursor-pointer flex justify-evenly items-center ${
                  selectPost === "allPosts" ? "bg-gray-500" : "bg-gray-700"
                } py-1 px-2 rounded-3xl transition-colors text-sm text-white`}
              >
                <input
                  type="radio"
                  name="selectPost"
                  className="hidden peer"
                  id="allPosts"
                  value="allPosts"
                  onChange={(e) =>onSelectionChange(e)}
                  checked={selectPost === "allPosts"}
                />
                <label
                  htmlFor="allPosts"
                  className="cursor-pointer text-center w-full"
                >
                  All Posts
                </label>
              </div>
            </div>

            {/* add new post */}
            <NewPost user={userData} />

            {/* Posts */}
            <AllPosts  userId={userData.uid} />
          </div>

          {/* Right Column - Chats */}
          <div className="w-[35%] bg-gray-800 rounded-lg shadow p-4">
            <div className="font-semibold mb-4">My Chats</div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                <div className="h-8 w-8 rounded-full bg-green-500"></div>
                <div>
                  <div className="font-medium text-gray-100">Jane Smith</div>
                  <div className="text-sm text-gray-400">Hey, how are you?</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
