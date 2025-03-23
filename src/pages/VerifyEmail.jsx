import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../firebase/firebaseAuth";
import { Loader, ErrorAlert, SuccessAlert, LeftSide } from "../components";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

function VerifyEmail() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const sendVerification = async () => {
      try {
        setError(null);
        await userAuth.sendVerificationEmail();
        setSuccessMessage("Verification email sent! Check your inbox.");
        timeoutRef.current = setTimeout(() => navigate("/login"), 5000);
      } catch (error) {
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
      setError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="flex flex-col  items-center justify-around md:flex-row w-full h-[90vh]  text-white"
      onClick={() => setError(null)}
    >
      {" "}
      {/* Left side */}
      <LeftSide />
      {/* Right side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md border-gray-800 bg-gray-950 shadow-xl">
          {error && (
            <ErrorAlert
              message={error}
              aria-live="assertive"
              className="mb-4"
            />
          )}
          {successMessage && (
            <SuccessAlert
              message={successMessage}
              aria-live="polite"
              className="mb-4"
            />
          )}
          {(loading || isResending) && <Loader />}

          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-gray-400">
              We've sent a verification link to your email. Click the link to
              verify your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={handleResend}
              disabled={isResending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </Button>

            <p className="text-sm text-gray-400 text-center">
              Return to{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                Login page
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default VerifyEmail;
