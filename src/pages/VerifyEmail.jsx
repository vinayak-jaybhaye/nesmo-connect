import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../firebase/firebaseAuth";
import { Loader, ErrorAlert, LeftSide } from "../components";

function VerifyEmail() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  // Send verification email on component mount
  useEffect(() => {
    const sendVerification = async () => {
      try {
        setError(null);
        await userAuth.sendVerificationEmail();
        setSuccessMessage("Verification email sent! Check your inbox.");
        setTimeout(() => navigate("/login"), 5000);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    sendVerification();
  }, [navigate]);

  // Handle resend verification email
  const handleResend = async () => {
    try {
      setIsResending(true);
      setError(null);
      await userAuth.sendVerificationEmail();
      setSuccessMessage("New verification email sent!");
    } catch (error) {
        console.log("Error:", error.message); 
        setError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      {error && <ErrorAlert message={error} />}
      {successMessage && <ErrorAlert message={successMessage} type="success" />}
      {(loading || isResending) && <Loader />}

      <div className="flex justify-evenly bg-black-600 h-[100vh] box-content overflow-hidden">
        {/* Left side */}
        <LeftSide />

        {/* Right side content */}
        <div className="w-[70vw] bg-black text-white">
          <div className="p-14 text-start">
            <div className="text-3xl mb-6 font-bold">
              <p>Verify Your Email Address</p>
            </div>

            <div className="text-white space-y-6">
              <p className="text-gray-300">
                We've sent a verification link to your email address. 
                Please check your inbox and click the link to verify your account.
              </p>

              <div className="mt-8">
                <p className="text-gray-400">
                  Didn't receive the email?{" "}
                  <button
                    onClick={handleResend}
                    className="text-blue-500 hover:text-blue-400 font-medium underline cursor-pointer disabled:opacity-50"
                    disabled={isResending}
                  >
                    Resend verification email
                  </button>
                </p>
              </div>

              <div className="mt-12 text-start">
                <p className="text-sm text-gray-500">
                  Return to{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-500 transition-all duration-200 hover:underline"
                  >
                    Login page
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

export default VerifyEmail;