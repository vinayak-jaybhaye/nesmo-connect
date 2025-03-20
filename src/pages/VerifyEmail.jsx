import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../firebase/firebaseAuth";
import { Loader, ErrorAlert, SuccessAlert, LeftSide } from "../components";

function VerifyEmail() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = React.useRef(null);

  useEffect(() => {
    const sendVerification = async () => {
      try {
        setError(null);
        await userAuth.sendVerificationEmail();
        setSuccessMessage("Verification email sent! Check your inbox.");
        timeoutRef.current = setTimeout(() => navigate("/login"), 5000);
      } catch (error) {
        console.error("Verification error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    sendVerification();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigate]);

  const handleResend = async () => {
    try {
      setIsResending(true);
      setError(null);
      await userAuth.sendVerificationEmail();
      setSuccessMessage("New verification email sent!");
    } catch (error) {
      console.error("Resend error:", error);
      setError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      {error && <ErrorAlert message={error} aria-live="assertive" />}
      {successMessage && (
        <SuccessAlert message={successMessage} aria-live="polite" />
      )}
      {(loading || isResending) && <Loader />}

      <div className="flex flex-col md:flex-row h-[90vh] w-full bg-gradient-to-br from-gray-900 to-black rounded-md overflow-auto">
        <LeftSide />

        <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
          <div className="w-full max-w-2xl space-y-8" role="main">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Verify Your Email Address
              </h1>

              <div className="space-y-4">
                <p className="text-lg text-gray-300 leading-relaxed">
                  We've sent a verification link to your email address. Please
                  check your inbox and click the link to verify your account.
                </p>

                <div className="pt-6 border-t border-gray-800">
                  <p className="text-gray-400">
                    Didn't receive the email?{" "}
                    <button
                      onClick={handleResend}
                      aria-label={
                        isResending
                          ? "Sending verification email"
                          : "Resend verification email"
                      }
                      className={`text-blue-400 hover:text-blue-300 font-medium transition-all
                        underline underline-offset-4 decoration-2 ${
                          isResending
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:opacity-80"
                        }`}
                      disabled={isResending}
                    >
                      {isResending ? "Sending..." : "Resend verification email"}
                    </button>
                  </p>
                </div>

                <div className="pt-8">
                  <p className="text-gray-500">
                    Return to{" "}
                    <Link
                      to="/login"
                      aria-label="Return to login page"
                      className="font-medium text-blue-400 hover:text-blue-300 
                        transition-colors underline underline-offset-4 decoration-2"
                    >
                      Login page
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyEmail;
