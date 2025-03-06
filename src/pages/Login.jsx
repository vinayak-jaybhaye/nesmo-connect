import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { Loader, ErrorAlert, LeftSide } from "../components";
import { useUserLocation } from "../components/helpers";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { location, locationErr } = useUserLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserLoggedIn = useSelector((state) => state.auth.status);

  useEffect(() => {
    const unsubscribe = userAuth.auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await dbServices.getDocument("users", user.uid);
          console.log(userData);
          delete userData.posts;
          userData.uid = user.uid;

          dispatch(
            login({
              userData: userData,
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

   useEffect(() => {
      if (location) {
        console.log("User Location:", location);
      }
    }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await userAuth.login(email, password, location);
    } catch (error) {
      setLoading(false);
      setError("Invalid email or password");
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

      {/* Login form */}
      <div
        className="flex justify-evenly bg-black-600 h-[100vh] box-content overflow-hidden "
        onClick={() => setError(null)}
      >
        {/* left side */}
        <LeftSide />

        {/* right side login form */}
        <div className="w-[70vw] bg-black text-white">
          <div className="p-14 text-start">
            <div className="text-3xl mb-6 font-bold">
              <p>Login to your account</p>
            </div>

            <div className="text-white">
              <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    className="w-[60%] px-4 py-1 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Login
                  </button>
                </div>
                <div className="mt-4 text-start flex">
                  <p className="text-sm text-gray-500">
                    Forgot your password?{" "}
                    <Link
                      to="/forgot-password"
                      className="font-medium text-blue-500 transition-all duration-200 hover:underline"
                    >
                      Reset here
                    </Link>
                  </p>
                </div>
              </form>
              <div className="mt-7 text-start ">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-500 transition-all duration-200 hover:underline"
                  >
                    Sign up
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

export default Login;
