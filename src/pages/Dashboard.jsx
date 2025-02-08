import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { login, logout } from "../store/authSlice";
import {
  AllPosts,
  Loader,
  Notifications,
  Connections,
  UserList,
  Chats,
  Communities,
} from "../components";
import { setVars } from "../store/varSlice";

import { NewPost } from "../components";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reload, setReload] = React.useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const selectPost = useSelector(
    (state) => state.vars.selectPost || "allPosts"
  );

  const onSelectionChange = (e) => {
    dispatch(setVars({ selectPost: e.target.value }));
  };

  useEffect(() => {
    const unsubscribe = userAuth.auth.onAuthStateChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const user = await dbServices.getDocument(
              "users",
              firebaseUser.uid
            );
            delete user.posts;
            user.uid = firebaseUser.uid;
            dispatch(login({ userData: user }));
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
  }, [dispatch, navigate, reload]);

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
    <div className="flex w-full min-h-screen justify-start bg-gray-900 text-gray-100 h-[100vh] overflow-scroll scrollbar-hide">
      {/* Left Sidebar */}

      <div className="w-[15%] sticky top-0  min-w-[200px] h-[100vh] bg-gray-800/80 p-4 space-y-4 border-r border-gray-700/50 backdrop-blur-md">
        <div
          className="mb-8 text-xl font-bold text-gray-100 border-b border-gray-700/50 pb-4 shadow-lg cursor-pointer"
          onClick={() => setReload(!reload)}
        >
          NESMO connect
        </div>
        <div className="space-y-2 overflow-scroll scrollbar-hide bg-gray-900 p-2 rounded-lg shadow-lg border border-black">
          {[
            { name: "Home", action: () => {} },
            { name: "Community", action: () => {} },
            { name: "Fundraiser", action: () => {} },
            { name: "Alumni Listing", action: () => navigate("/all-users") },
            { name: "About Us", action: () => {} },
          ].map((item) => (
            <div
              key={item.name}
              onClick={item.action}
              className="p-2.5 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-all duration-200 text-gray-300 hover:text-gray-100 flex items-center gap-2"
            >
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>

        <Communities />
      </div>

      {/* Main Content Area */}
      <div className="w-[85%] bg-gray-900/95 backdrop-blur-sm">
        {/* Navbar */}
        <div className="bg-gray-800/80 sticky top-0 z-10 shadow-lg p-2 flex justify-between items-center rounded-sm border-b border-gray-600/50 backdrop-blur-sm">
          <div className="text-lg font-semibold text-gray-100">Home</div>
          <div className="flex items-center space-x-4">
            <div
              onClick={handleLogout}
              className="cursor-pointer bg-gray-700/50 hover:bg-gray-600/60 rounded-xl px-3 py-1.5 transition-all duration-200 text-sm flex items-center gap-1.5 hover:ring-1 hover:ring-gray-500"
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
              Logout
            </div>
            <button
              className="p-2 hover:bg-gray-700/50 rounded-full size-12 transition-all duration-200 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <img
                src={
                  userData.notifications?.length > 0
                    ? "notification-active.svg"
                    : "notification.svg"
                }
                alt=""
                className="w-6 h-6 mx-auto transition-transform hover:scale-110"
              />
              {userData.notifications?.length > 0 && (
                <div className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full ring-1 ring-red-400"></div>
              )}
            </button>
            <div
              className="h-9 w-9 rounded-full ring-2 ring-gray-600/80 hover:ring-green-500 cursor-pointer transition-all overflow-hidden"
              onClick={() => navigate("/profile/" + userData.uid)}
            >
              <img
                src={userData?.avatarUrl || "/avatar.png"}
                alt="profile"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-around p-4 gap-4 h-[100%] ">
          {/* Left Column */}
          <div className="w-[60%] space-y-4 overflow-scroll scrollbar-hide">
            {/* Post Selection */}
            <div className="flex justify-start gap-2 items-center mt-3 w-[70%]">
              {["allPosts", "myPosts"].map((option) => (
                <div
                  key={option}
                  className={`cursor-pointer flex justify-evenly items-center ${
                    selectPost === option
                      ? "bg-gradient-to-br from-gray-600/50 to-gray-700/50 ring-1 ring-gray-500/50 bg-blue-700"
                      : "bg-gray-700/50 hover:bg-gray-600/60"
                  } py-1.5 px-3 rounded-2xl transition-all duration-200 text-sm text-white/90 hover:text-white ring-transparent`}
                >
                  <input
                    type="radio"
                    name="selectPost"
                    className="hidden"
                    id={option}
                    value={option}
                    onChange={onSelectionChange}
                    checked={selectPost === option}
                  />
                  <label htmlFor={option} className="cursor-pointer capitalize">
                    {option.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                </div>
              ))}
            </div>

            {/* New Post & Feed */}
            <div className="space-y-6">
              <NewPost user={userData} />
              <AllPosts userId={userData.uid} />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-[35%] space-y-4 h-[100%] overflow-scroll">
            {showNotifications && (
              <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl shadow-xl p-4 backdrop-blur-sm">
                <Notifications
                  notifications={userData.notifications}
                  userData={userData}
                />
              </div>
            )}

            <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4 shadow-xl backdrop-blur-sm">
              <Chats />
            </div>

            <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4 shadow-xl backdrop-blur-sm">
              <Connections />
            </div>

            <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4 shadow-xl backdrop-blur-sm">
              <UserList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
