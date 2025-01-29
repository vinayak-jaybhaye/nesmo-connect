import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { login } from "../store/authSlice";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, ErrorAlert, LeftSide } from "../components";

function Login() {
  // ... existing logic remains the same ...
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          dispatch(login({ userData }));
          navigate("/dashboard");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);

      await userAuth.login(email, password);
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
      {error && <ErrorAlert message={error} />}
      {loading && <Loader />}

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row">
            {/* Left Side */}
            <div className="md:w-1/2 bg-gradient-to-tr from-blue-600 to-purple-500 p-12 flex flex-col justify-center">
              <LeftSide /> {/* Assuming LeftSide has its own styling */}
            </div>

            {/* Right Side */}
            <div className="md:w-1/2 p-12 space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-300">
                  Sign in to continue your journey
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 text-gray-100 transition-all"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 text-gray-100 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-[1.01] shadow-lg"
                >
                  Login
                </button>
                <div className="mt-4 text-start flex justify-center">
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

              <div className="text-center text-gray-400">
                <p>
                  New here?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Create an account
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
