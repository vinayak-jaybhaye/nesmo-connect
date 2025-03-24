import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { Loader, ErrorAlert, LeftSide } from "../components";
import { useUserLocation } from "../components/helpers";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("student");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { location, locationErr } = useUserLocation();
  const [adminCode, setAdminCode] = useState("");
  const [school, setSchool] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);

      const isEmailTaken = await userAuth.isUserExists(email);
      if (isEmailTaken) {
        throw new Error("Email already in use");
      }

      await userAuth.register(email, password, name, userRole, location);
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
        className="flex flex-col justify-around items-center md:flex-row w-full  h-[90vh] text-white"
        onClick={() => setError(null)}
      >
        {/* left side */}
        <LeftSide />

        {/* right side register form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md border-gray-800 bg-gray-950 shadow-xl">
            {error && (
              <Alert
                variant="destructive"
                className="mb-4 border-red-900 bg-red-950"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                Create an Account
              </CardTitle>
              <CardDescription className="text-gray-400">
                Join the Nesmo Connect
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-gray-900 border-gray-800 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
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

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-900 border-gray-800 text-white"
                  />
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sign up as</label>
                  <div className="flex justify-between">
                    {["student", "alumnus", "admin"].map((role) => (
                      <div
                        key={role}
                        className={`cursor-pointer p-1 rounded-md w-20 sm:w-32 md:w-34 text-center transition-colors ${
                          userRole === role
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 text-gray-800"
                        }`}
                        onClick={() => setUserRole(role)}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Fields */}
                {userRole === "admin" && (
                  <div className="space-y-2">
                    <label htmlFor="adminCode" className="text-sm font-medium">
                      Admin Code
                    </label>
                    <Input
                      id="adminCode"
                      type="text"
                      placeholder="Enter admin code"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className="bg-gray-900 border-gray-800 text-white"
                    />
                  </div>
                )}

                {userRole !== "admin" && (
                  <div className="space-y-2">
                    <label htmlFor="school" className="text-sm font-medium">
                      School
                    </label>
                    <Input
                      id="school"
                      type="text"
                      placeholder="Enter your school name"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="bg-gray-900 border-gray-800 text-white"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                <div className="text-sm text-gray-400">
                  Already have an account?{" "}
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
    </>
  );
}

export default Register;
