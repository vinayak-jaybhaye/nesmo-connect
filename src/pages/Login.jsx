import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
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
import { LeftSide } from "../components";

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
          navigate("/");
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
    return null;
  }

  return (
    <div
      className="flex flex-col  items-center justify-around md:flex-row w-full h-[90vh]  text-white"
      onClick={() => setError(null)}
    >
      <LeftSide />
      {/* Left side - visible on medium screens and up */}

      {/* Right side - login form */}
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

          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Login to your account
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access the NGO connection platform
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-sm text-gray-400">
                Forgot your password?{" "}
                <Link
                  to="/forgot-password"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Reset here
                </Link>
              </div>

              <div className="pt-4 text-center border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
