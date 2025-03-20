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
      {error && <ErrorAlert message={error} aria-live="assertive" />}
      {successMessage && (
        <SuccessAlert message={successMessage} aria-live="polite" />
      )}
      {loading && <Loader />}

      <div className="flex flex-col md:flex-row h-[90vh] w-full bg-gradient-to-br from-gray-900 to-black rounded-md">
        {/* Left side */}
        <LeftSide />

        {/* Right side form */}
        <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
          <div className="w-full max-w-2xl space-y-8" role="main">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Reset Your Password
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-lg font-medium text-gray-300 mb-2"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg
                        text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400
                        focus:border-transparent transition-all"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full max-w-xs px-6 py-3 bg-blue-600 hover:bg-blue-700
                      text-white font-semibold rounded-lg transition-all
                      transform hover:scale-[1.02] disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <p className="text-gray-400">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-blue-400 hover:text-blue-300
                        transition-colors underline underline-offset-4 decoration-2"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
