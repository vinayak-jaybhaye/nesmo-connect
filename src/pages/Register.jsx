import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { Loader, ErrorAlert, LeftSide } from "../components";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("student");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserLoggedIn = useSelector((state) => state.auth.status);

  useEffect(() => {
    const unsubscribe = userAuth.auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await dbServices.getDocument("users", user.uid);
          const {
            avatarFileId,
            coverFileId,
            avatarUrl,
            coverUrl,
            email,
            name,
            userRole,
          } = userData;
          const updatedUserData = {
            uid: user.uid,
            avatarFileId,
            coverFileId,
            avatarUrl,
            coverUrl,
            email,
            name,
            userRole,
          };

          dispatch(
            login({
              userData: updatedUserData,
            })
          );
          navigate("/dashboard");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);

      const isEmailTaken = await userAuth.isUserExists(email);
      if (isEmailTaken) {
        throw new Error("Email already in use");
      }

      await userAuth.register(email, password, name, userRole);
    } catch (error) {
      setLoading(false);
      setError(error.message || "Registration failed");
      console.error("Error:", error.message);
    }
  };

  if (isUserLoggedIn) {
    return null; // Already handled by useEffect redirect
  }

  return (
    <>
      {/* Error message */}
      {error && <ErrorAlert message={error} />}

      {/* Loading spinner */}
      {loading && <Loader />}

      {/* Register form */}
      <div
        className="flex justify-evenly bg-black-600 h-[100vh] box-content overflow-hidden "
        onClick={() => setError(null)}
      >
        {/* left side */}
        <LeftSide />

        {/* right side register form */}
        <div className="w-[70vw] bg-black text-white">
          <div className="p-14 text-start">
            <div className="text-3xl mb-6 font-bold">
              <p>Let's get started</p>
            </div>

            <div className="text-white">
              <form onSubmit={handleRegister} className="flex flex-col gap-5">
                <div className="mb-4">
                  <div className="mb-4 text-start ">
                    <label
                      htmlFor="userRole"
                      className="block text-white text-xl font-medium"
                    >
                      Sign up as :
                    </label>

                    <div className="flex justify-between items-center mt-3 w-[70%]">
                      <div
                        className={`cursor-pointer flex justify-evenly ${
                          userRole === "student"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-800"
                        } py-1 px-2 rounded-md w-32 transition-colors`}
                      >
                        <input
                          type="radio"
                          name="userRole"
                          className="hidden peer"
                          id="student"
                          value="student"
                          onChange={(e) => setUserRole(e.target.value)}
                          checked={userRole === "student"}
                        />
                        <label htmlFor="student" className="cursor-pointer">
                          Student
                        </label>
                      </div>

                      <div
                        className={`cursor-pointer flex justify-evenly ${
                          userRole === "alumnus"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-800"
                        } py-1 px-2 rounded-md w-32 transition-colors`}
                      >
                        <input
                          type="radio"
                          name="userRole"
                          className="hidden peer"
                          id="alumnus"
                          value="alumnus"
                          onChange={(e) => setUserRole(e.target.value)}
                          checked={userRole === "alumnus"}
                        />
                        <label htmlFor="alumnus" className="cursor-pointer">
                          Alumnus
                        </label>
                      </div>

                      <div
                        className={`cursor-pointer flex justify-evenly ${
                          userRole === "admin"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-800"
                        } py-1 px-2 rounded-md w-32 transition-colors`}
                      >
                        <input
                          type="radio"
                          name="userRole"
                          className="hidden peer"
                          id="admin"
                          value="admin"
                          onChange={(e) => setUserRole(e.target.value)}
                          checked={userRole === "admin"}
                        />
                        <label htmlFor="admin" className="cursor-pointer">
                          Admin
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="text-start">
                    <label
                      htmlFor="name"
                      className="block text-white text-xl font-medium"
                    >
                      Name
                    </label>
                  </div>
                  <input
                    type="text"
                    id="name"
                    className="w-[60%] p-1 text-black bg-gray-300 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <div className="text-start">
                    <label
                      htmlFor="email"
                      className="block text-white text-xl font-medium"
                    >
                      Email
                    </label>
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="w-[60%] p-1 mt-2 text-black border bg-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <div className="text-start">
                    <label
                      htmlFor="password"
                      className="block text-white text-xl font-medium"
                    >
                      Password
                    </label>
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="w-[60%] p-1 mt-2 border bg-gray-300 text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    value={password}
                    minLength={6}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    className="w-[60%] px-4 py-1 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Sign up
                  </button>
                </div>
              </form>
              <div className="mt-7 text-start ">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-500 transition-all duration-200 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
