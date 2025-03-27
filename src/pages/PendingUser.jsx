"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  User,
  School,
  Shield,
  Phone,
  GraduationCap,
  FileText,
} from "lucide-react";
import { ErrorAlert } from "../components";
import dbServices from "../firebase/firebaseDb";
import userAuth from "../firebase/firebaseAuth";
import { login } from "../store/authSlice";
import { Loader2 } from "lucide-react";

function PendingUser() {
  const user = useSelector((state) => state.auth.userData);
  const [name, setName] = useState(user?.name || "");
  const [userRole, setUserRole] = useState(user?.userRole || "student");
  const [adminCode, setAdminCode] = useState("");
  const [school, setSchool] = useState(user?.school || "");
  const [phone, setPhone] = useState(user?.personalData?.phone || "");
  const [batch, setBatch] = useState(user?.personalData?.batch || "");
  const [about, setAbout] = useState(user?.personalData?.about || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [sendingVerification, setSendingVerification] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (user?.userVerificationStatus === "verified") {
        window.location.href = "/";
      }
      try {
        if (!user?.uid) {
          return;
        }
        const userData = await dbServices.getDocument(
          "pendingUsers",
          user?.uid
        );
        if (userData) {
          setName(userData.name || user?.name || "");
          setUserRole(userData.userRole || user?.userRole || "student");
          setSchool(userData.personalData?.school || user?.school || "");
          setPhone(userData.personalData?.phone || "");
          setBatch(userData.personalData?.batch || "");
          setAbout(userData.personalData?.about || "");
        }
        if (!userData?.emailVerified) {
          if (await userAuth.isEmailVerified()) {
            dbServices.updateDocument("pendingUsers", user?.uid, {
              emailVerified: true,
            });
            delete userData.createdAt;
            dispatch(
              login({
                userData: { ...userData, emailVerified: true },
              })
            );

            if (user?.userRole === "admin") {
              await dbServices.acceptPendingUser(user.uid);
              window.location.href = "/";
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    fetchUserStatus();
  }, [user?.uid, dispatch]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare updated data
      const updatedData = {
        name: name,
        email: user.email,
        userRole: userRole,
        personalData: {
          school: school,
          phone: phone,
          batch: batch,
          about: about,
        },
        userVerificationStatus: "pending",
      };

      if (userRole === "admin") {
        // Validate admin code
        if (adminCode !== import.meta.env.VITE_ADMIN_SECRET_CODE) {
          throw new Error("Invalid admin code");
        }
        // Update pending user and approve immediately
        await dbServices.updateDocument("pendingUsers", user.uid, updatedData);
        if (user?.emailVerified) {
          await dbServices.acceptPendingUser(user.uid);
          window.location.href = "/";
        }
      } else {
        // Regular user update (remains in pending)
        await dbServices.updateDocument("pendingUsers", user.uid, updatedData);
        dispatch(login({ userData: { ...user, ...updatedData } }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      setError(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    setSendingVerification(true);
    try {
      await userAuth.sendVerificationEmail();
      alert("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Failed to send verification email. Please try again.");
    }
    setSendingVerification(false);
  };

  const getStatusBadge = () => {
    switch (user?.userVerificationStatus) {
      case "pending":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </div>
        );
      case "rejected":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </div>
        );
      case "verified":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <Loader2 />;
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl">
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader className="pb-4 border-b border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  Verification Status
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Complete your profile for review
                </CardDescription>
              </div>
              <div className="mt-2 sm:mt-0">{getStatusBadge()}</div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            {error && <ErrorAlert message={error} />}
            {!user?.emailVerified ? (
              <Alert className="mb-4 border-yellow-800 bg-yellow-900 text-yellow-400">
                <Mail className="h-4 w-4 mr-2" />
                <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span>
                    Your email is not verified. Please verify your email to
                    proceed.
                  </span>
                  <Button
                    className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-md w-full sm:w-auto"
                    onClick={sendVerificationEmail}
                    disabled={sendingVerification}
                  >
                    {sendingVerification ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Verification Email"
                    )}
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mb-4 border-green-800 bg-green-900 text-green-400">
                <CheckCircle className="h-4 w-4 mr-2" />
                <AlertDescription>Email Verified ✅</AlertDescription>
              </Alert>
            )}

            {showSuccess && (
              <Alert className="mb-4 border-green-800 bg-green-900 text-green-400">
                <CheckCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}

            {user?.userVerificationStatus === "incomplete" ? (
              <Alert className="mb-4 border-yellow-800 bg-yellow-900 text-yellow-400">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Please fill the basic details and complete your profile.
                </AlertDescription>
              </Alert>
            ) : !user?.emailVerified ? (
              <Alert className="mb-4 border-yellow-800 bg-yellow-900 text-yellow-400">
                <Mail className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Please verify your email address to proceed.
                </AlertDescription>
              </Alert>
            ) : user?.userVerificationStatus === "pending" ? (
              <Alert className="mb-4 border-yellow-800 bg-yellow-900 text-yellow-400">
                <Clock className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Your account is awaiting admin approval.
                </AlertDescription>
              </Alert>
            ) : user?.userVerificationStatus === "rejected" ? (
              <Alert
                variant="destructive"
                className="mb-4 border-red-900 bg-red-950"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  <span className="font-semibold">
                    Your application was rejected.
                  </span>
                  <div className="mt-2 text-sm bg-red-950/50 p-2 rounded-md">
                    {user?.verificationRemark || "No reason provided by admin."}
                  </div>
                </AlertDescription>
              </Alert>
            ) : null}

            <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  Full Name
                </label>
                <Input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-700/50 border-gray-600 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed after registration
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
                  User Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["student", "alumnus", "admin"].map((role) => (
                    <div
                      key={role}
                      className={`cursor-pointer p-2 rounded-md text-center transition-colors ${
                        userRole === role
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => setUserRole(role)}
                    >
                      {role === "student" && (
                        <School className="h-4 w-4 mx-auto mb-1" />
                      )}
                      {role === "alumnus" && (
                        <User className="h-4 w-4 mx-auto mb-1" />
                      )}
                      {role === "admin" && (
                        <Shield className="h-4 w-4 mx-auto mb-1" />
                      )}
                      <span className="text-xs">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {userRole === "admin" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-gray-400" />
                    Admin Code
                  </label>
                  <Input
                    required
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter admin verification code"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Admin accounts require verification code from existing
                    administrators
                  </p>
                </div>
              )}

              {userRole !== "admin" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <School className="h-4 w-4 mr-2 text-gray-400" />
                    School
                  </label>
                  <Input
                    required
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter your school name"
                  />
                </div>
              )}

              {/* Optional fields */}
              {userRole != "admin" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        Phone (Optional)
                      </label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                        Batch (Optional)
                      </label>
                      <Input
                        type="text"
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter your batch/year"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      About Yourself (Optional)
                    </label>
                    <Textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className="bg-gray-700 w-full border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Tell us a bit about yourself to help admins identify you"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col border-t border-gray-700 pt-4 pb-4 px-4 sm:px-6">
            <p className="text-xs text-gray-400 text-center">
              Your profile will be reviewed by an administrator before you can
              access the platform. This process typically takes 1-2 business
              days.
            </p>
          </CardFooter>
        </Card>

        {user?.userVerificationStatus === "pending" ? (
          <div className="mt-4 sm:mt-6 bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 shadow-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              What happens next?
            </h3>
            <ol className="space-y-2 sm:space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs text-white">1</span>
                </div>
                <p>
                  Your profile information will be reviewed by an administrator
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs text-white">2</span>
                </div>
                <p>
                  You'll receive an email notification when your account is
                  approved or rejected
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs text-white">3</span>
                </div>
                <p>
                  Once approved, you'll have full access to the platform and its
                  features
                </p>
              </li>
            </ol>
          </div>
        ) : (
          <div className="mt-4 sm:mt-6 bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 shadow-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Why your request was rejected?
            </h3>
            <ol className="space-y-2 sm:space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs text-white">1</span>
                </div>
                <p>
                  Your profile information may be incomplete or inaccurate.
                  Please update your profile information to request verification
                  again.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs text-white">2</span>
                </div>
                <p>
                  Once you've updated your profile, your request will be
                  reviewed by an administrator
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs text-white">3</span>
                </div>
                <p>
                  Once approved, you'll have full access to the platform and its
                  features
                </p>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingUser;
