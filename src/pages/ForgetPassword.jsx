import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../firebase/firebaseAuth";
import { Loader, ErrorAlert, LeftSide, SuccessAlert } from "../components";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col justify-around items-center md:flex-row w-full h-[90vh] text-white"
      onClick={() => setError(null)}
    >
      {/* Left side */}
      <LeftSide />

      {/* Right side form */}
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
          {loading && <Loader />}

          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your registered email to receive a password reset link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-800 text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-sm text-gray-400">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Login here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;
