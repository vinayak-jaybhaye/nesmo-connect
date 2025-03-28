"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import { login } from "../store/authSlice";
import { AllPosts, Loader, RightSidebar } from "../components";
import { setVars } from "../store/varSlice";
import { Home, User, Bookmark } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

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
            const user = await userAuth.getCurrentUserData();
            user.uid = firebaseUser.uid;
            delete user.createdAt;
            dispatch(login({ userData: user }));
          } catch (error) {
            console.error("Error fetching user data:", error);
            navigate("/login");
          }
        } else {
          navigate("/landing");
        }
      }
    );
    return () => unsubscribe();
  }, [dispatch, navigate, reload]);

  if (!userData) {
    return <Loader />;
  }

  // Map options to their respective icons
  const optionIcons = {
    allPosts: <Home className="w-4 h-4 mr-1.5" />,
    myPosts: <User className="w-4 h-4 mr-1.5" />,
    savedPosts: <Bookmark className="w-4 h-4 mr-1.5" />,
  };

  // Helper function to format option labels
  const formatOptionLabel = (option) => {
    return option
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className="flex justify-between gap-4 w-full max-w-screen-2xl">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Post Selection Filter */}
        <div className="sticky top-[4.5rem] z-10 bg-gray-900/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-800/50 p-2 sm:p-3 mt-3 transition-all">
          <div className="flex flex-wrap justify-start gap-2">
            {["allPosts", "myPosts", "savedPosts"].map((option) => (
              <div
                key={option}
                className={`
                  flex-1 sm:flex-none cursor-pointer transition-all duration-200
                  ${
                    selectPost === option
                      ? "bg-gradient-to-br from-indigo-600/80 to-indigo-800/80 shadow-md shadow-indigo-900/30"
                      : "bg-gray-800/80 hover:bg-gray-700/80"
                  }
                  rounded-xl overflow-hidden
                `}
              >
                <input
                  type="radio"
                  name="selectPost"
                  className="sr-only"
                  id={option}
                  value={option}
                  onChange={onSelectionChange}
                  checked={selectPost === option}
                />
                <label
                  htmlFor={option}
                  className="flex items-center justify-center w-full py-2 px-3 sm:px-4 cursor-pointer text-sm sm:text-base font-medium text-white/90 hover:text-white"
                >
                  <span className="hidden sm:inline-flex items-center">
                    {optionIcons[option]}
                    {formatOptionLabel(option)}
                  </span>
                  <span className="sm:hidden inline-flex items-center">
                    {optionIcons[option]}
                    <span className="text-xs">
                      {formatOptionLabel(option).split(" ")[0]}
                    </span>
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6 w-full pb-20">
          <AllPosts user={userData} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:flex sticky top-20 max-w-[30%]">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Dashboard;
