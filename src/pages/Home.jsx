import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { login, logout } from "../store/authSlice";
import { AllPosts, Loader, RightSidebar } from "../components";
import { setVars } from "../store/varSlice";

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
            const user = await dbServices.getDocument(
              "users",
              firebaseUser.uid
            );
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

  if (!userData) {
    return <Loader />;
  }

  return (
    <div className="flex justify-between gap-2 w-full relative">
      <div className={`space-y-4 w-full`}>
        {/* Post Selection */}
        <div className="flex justify-start gap-2 items-center mt-3 sticky top-0 bg-gray-900/80 p-2 rounded-lg shadow-lg border border-gray-800/50 backdrop-blur-sm">
          {["allPosts", "myPosts", "savedPosts"].map((option) => (
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
          <AllPosts user={userData} />
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Dashboard;
