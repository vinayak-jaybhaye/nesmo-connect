import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../firebase/firebaseAuth";
import { Loader, ErrorAlert, LeftSide, SuccessAlert } from "../components";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      
      await userAuth.sendPasswordReset(email);
      setSuccessMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <ErrorAlert message={error} />}
      {successMessage && <SuccessAlert message={successMessage} type="success" />}
      {loading && <Loader />}

      <div className="flex justify-evenly bg-black-600 h-[100vh] box-content overflow-hidden">
        {/* Left side */}
        <LeftSide />

        {/* Right side form */}
        <div className="w-[70vw] bg-black text-white">
          <div className="p-14 text-start">
            <div className="text-3xl mb-6 font-bold">
              <p>Reset Your Password</p>
            </div>

            <div className="text-white">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    className="w-[60%] px-4 py-1 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
              
              <div className="mt-7 text-start ">
                <p className="text-sm text-gray-500">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-500 transition-all duration-200 hover:underline"
                  >
                    Login here
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

export default ForgotPassword;