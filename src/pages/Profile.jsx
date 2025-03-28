"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { login, logout } from "../store/authSlice";
import { setVars } from "../store/varSlice";
import { Loader, ProfileConnections } from "../components";
import { generateChatId } from "../utils/helper";
import appwriteStorage from "../appwrite/appwriteStorage";
import {
  Edit2,
  LogOut,
  MessageCircle,
  UserPlus,
  Users,
  Briefcase,
  MapPin,
  GraduationCap,
  Linkedin,
  Twitter,
  Github,
  Globe,
  Mail,
  Calendar,
  Award,
  CheckCircle,
} from "lucide-react";

function Profile() {
  const { profileId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [amIOwner, setAmIOwner] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({
    avatar: false,
    cover: false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [connectionStatus, setConnectionStatus] = useState("Connect");

  const fetchConnectionStatus = async () => {
    if (userData?.uid) {
      const status = await dbServices.getConnectionStatus(
        userData?.uid,
        profileId
      );
      setConnectionStatus(status);
    }
  };

  useEffect(() => {
    const unsubscribe = userAuth.auth.onAuthStateChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const user = await dbServices.getDocument(
              "users",
              firebaseUser.uid
            );
            delete user.posts;
            delete user.createdAt;
            user.uid = firebaseUser.uid;

            dispatch(login({ userData: user }));
          } catch (error) {
            console.error("Error fetching user data:", error);
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      }
    );
    return () => unsubscribe();
  }, [dispatch, navigate]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) navigate("/");
      setIsLoading(true);
      setShowConnections(false);
      try {
        const profile = await dbServices.getDocument("users", profileId);
        setProfileData(profile);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (profileId) {
      fetchProfileData();
      fetchConnectionStatus();
      setAmIOwner(profileId === userData?.uid);
    }
  }, [profileId, userData]);

  const handleLogout = async () => {
    try {
      await userAuth.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const handleConnect = async (profData) => {
    // Send connection request
    profData.uid = profileId;
    await dbServices.sendConnectionRequest(userData, profData);
    setConnectionStatus("sent");
  };

  const handleChangeImage = async (img) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg, image/jpg, image/gif, image/webp";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          setImageLoading((prev) => ({ ...prev, [img]: true }));

          // Upload the selected file directly
          const fileData = await appwriteStorage.uploadFile(file);
          const fileId = fileData["$id"];
          const imageUrl = appwriteStorage.getFilePreview(fileId);

          const updatedData = {
            [img + "Url"]: imageUrl,
            [img + "FileId"]: fileId,
          };

          // Delete old image if exists
          if (userData[img + "FileId"]) {
            await appwriteStorage.deleteFile(userData[img + "FileId"]);
          }

          // Update user document
          await dbServices.updateDocument("users", userData.uid, updatedData);

          // Update local state and Redux store
          const updatedUser = { ...userData, ...updatedData };
          dispatch(login({ userData: updatedUser }));

          // Refresh profile data
          const profile = await dbServices.getDocument("users", profileId);
          setProfileData(profile);
        } catch (error) {
          console.error("Error updating image:", error);
        } finally {
          setImageLoading((prev) => ({ ...prev, [img]: false }));
        }
      }
    };
    input.click();
  };

  const handleMessage = async () => {
    const chatId = generateChatId(userData.uid, profileId);
    const isChatExist = await dbServices.checkChatExists(chatId, userData.uid);
    if (isChatExist) {
      dispatch(setVars({ selectChat: chatId }));
      navigate("/chats/" + chatId);
    } else {
      await dbServices.createGroupChat(
        chatId,
        [userData.uid, profileId],
        "private",
        [userData.name, profileData.name]
      );
    }
    dispatch(setVars({ selectChat: chatId }));
    navigate("/chats/" + chatId);
  };

  if (isLoading || !userData) {
    return <Loader />;
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-300 mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Get connection count
  const connectionCount = profileData?.connections?.length || 0;

  // Format connection status button text and style
  const getConnectionButtonStyle = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "sent":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "received":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      default:
        return "bg-gray-700 hover:bg-gray-600 text-white";
    }
  };

  const getConnectionButtonText = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <span className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Connected
          </span>
        );
      case "sent":
        return "Request Sent";
      case "received":
        return "Accept Request";
      default:
        return (
          <span className="flex items-center">
            <UserPlus className="w-4 h-4 mr-1.5" />
            Connect
          </span>
        );
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 w-full overflow-auto"
      onClick={() => setShowConnections(false)}
    >
      {/* Banner Section */}
      <div className="h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-r from-indigo-900/80 to-blue-900/80 overflow-hidden relative">
        <img
          src={profileData?.coverUrl || "/cover.svg?height=300&width=1200"}
          className="w-full h-full object-cover opacity-60 transition-opacity duration-300"
          alt="Cover"
          onLoad={() => setImageLoading((prev) => ({ ...prev, cover: false }))}
        />

        {/* Cover image edit button */}
        {amIOwner && (
          <button
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2 bg-gray-900/80 hover:bg-gray-800 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm group"
            onClick={() => handleChangeImage("cover")}
            disabled={imageLoading.cover}
          >
            {imageLoading.cover ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <Edit2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            )}
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="flex flex-col bg-gray-900 relative">
        {/* Profile Header */}
        <div className="relative flex flex-col px-4 sm:px-6 pt-16 sm:pt-20 md:pt-2 pb-6">
          {/* Profile Avatar */}
          <div className="absolute -top-16 sm:-top-20 md:-top-24 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 z-10">
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-900 shadow-2xl">
                <img
                  src={profileData?.avatarUrl || "/avatar.png"}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  alt="Profile"
                  onLoad={() =>
                    setImageLoading((prev) => ({ ...prev, avatar: false }))
                  }
                />
              </div>

              {/* Avatar edit button */}
              {amIOwner && (
                <button
                  className="absolute bottom-2 right-2 p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg transition-all duration-200"
                  onClick={() => handleChangeImage("avatar")}
                  disabled={imageLoading.avatar}
                >
                  {imageLoading.avatar ? (
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    <Edit2 className="w-4 h-4 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="md:ml-48 md:pl-8 flex flex-col md:flex-row items-center md:items-start justify-between mt-4 md:mt-0 space-y-4 md:space-y-0">
            <div className="w-full md:w-[60%] text-center md:text-left space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {profileData?.name}
                </h1>

                {/* Message button (only shown if not profile owner) */}
                {!amIOwner && (
                  <button
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-200"
                    onClick={handleMessage}
                    title="Send Message"
                  >
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                  </button>
                )}
              </div>

              {/* User role badge and action buttons */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-md text-sm font-medium shadow-md">
                  {profileData?.userRole?.toUpperCase() || "USER"}
                </span>

                {/* Connection button (only shown if not profile owner) */}
                {!amIOwner && (
                  <button
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-md ${getConnectionButtonStyle()}`}
                    onClick={() => handleConnect(profileData)}
                    disabled={["sent", "connected"].includes(connectionStatus)}
                  >
                    {getConnectionButtonText()}
                  </button>
                )}

                {/* Connections button */}
                <button
                  className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors shadow-md flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConnections(!showConnections);
                  }}
                >
                  <Users className="w-4 h-4 mr-1.5" />
                  <span>Connections</span>
                </button>
              </div>

              {/* Social links */}
              <div className="flex justify-center md:justify-start gap-3">
                {profileData.personalData?.linkedin && (
                  <a
                    href={profileData.personalData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-blue-700 rounded-full transition-colors duration-200"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-gray-300" />
                  </a>
                )}
                {profileData.personalData?.twitter && (
                  <a
                    href={profileData.personalData.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-blue-500 rounded-full transition-colors duration-200"
                    title="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-gray-300" />
                  </a>
                )}
                {profileData.personalData?.github && (
                  <a
                    href={profileData.personalData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5 text-gray-300" />
                  </a>
                )}
                {profileData.personalData?.website && (
                  <a
                    href={profileData.personalData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-green-700 rounded-full transition-colors duration-200"
                    title="Website"
                  >
                    <Globe className="w-5 h-5 text-gray-300" />
                  </a>
                )}
                {profileData.email && (
                  <a
                    href={`mailto:${profileData.email}`}
                    className="p-2 bg-gray-800 hover:bg-red-700 rounded-full transition-colors duration-200"
                    title="Email"
                  >
                    <Mail className="w-5 h-5 text-gray-300" />
                  </a>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {amIOwner && (
              <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                <button
                  className="w-full md:w-auto px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md flex items-center justify-center"
                  onClick={() => navigate(`/edit-profile/${userData.uid}`)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button
                  className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-sm font-medium transition-colors shadow-md flex items-center justify-center"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <GraduationCap className="w-5 h-5 text-indigo-400 mr-2" />
                <h3 className="text-indigo-400 text-sm font-medium">
                  Education
                </h3>
              </div>
              <p className="text-white">
                {profileData?.personalData?.education || "Not Specified"}
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-indigo-400 mr-2" />
                <h3 className="text-indigo-400 text-sm font-medium">
                  Location
                </h3>
              </div>
              <p className="text-white">
                {profileData?.personalData?.city || "Not Specified"}
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <Briefcase className="w-5 h-5 text-indigo-400 mr-2" />
                <h3 className="text-indigo-400 text-sm font-medium">
                  Position
                </h3>
              </div>
              <p className="text-white">
                {profileData?.personalData?.position || "Not Specified"}
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-indigo-400 mr-2" />
                <h3 className="text-indigo-400 text-sm font-medium">Joined</h3>
              </div>
              <p className="text-white">
                {profileData?.createdAt
                  ? new Date(
                      profileData.createdAt.seconds * 1000
                    ).toLocaleDateString()
                  : "Not Available"}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white">About</h2>
              <div className="ml-4 h-px bg-gradient-to-r from-indigo-500 to-transparent flex-grow"></div>
            </div>
            <div className="bg-gray-800/50 p-5 rounded-lg shadow-md border border-gray-700/50 backdrop-blur-sm">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {profileData?.personalData?.about || "No bio provided"}
              </p>
            </div>
          </div>

          {/* Skills & Interests Section (if available) */}
          {(profileData?.personalData?.skills?.length > 0 ||
            profileData?.personalData?.interests?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              {profileData?.personalData?.skills?.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold text-white">Skills</h2>
                    <div className="ml-4 h-px bg-gradient-to-r from-indigo-500 to-transparent flex-grow"></div>
                  </div>
                  <div className="bg-gray-800/50 p-5 rounded-lg shadow-md border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex flex-wrap gap-2">
                      {profileData.personalData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-indigo-900/60 text-indigo-200 rounded-md text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Interests */}
              {profileData?.personalData?.interests?.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold text-white">Interests</h2>
                    <div className="ml-4 h-px bg-gradient-to-r from-indigo-500 to-transparent flex-grow"></div>
                  </div>
                  <div className="bg-gray-800/50 p-5 rounded-lg shadow-md border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex flex-wrap gap-2">
                      {profileData.personalData.interests.map(
                        (interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-blue-900/60 text-blue-200 rounded-md text-sm"
                          >
                            {interest}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Achievements Section (if available) */}
          {profileData?.achievements?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-white">Achievements</h2>
                <div className="ml-4 h-px bg-gradient-to-r from-indigo-500 to-transparent flex-grow"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 p-4 rounded-lg shadow-md border border-gray-700/50 backdrop-blur-sm flex items-start"
                  >
                    <Award className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {achievement.description}
                      </p>
                      {achievement.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {achievement.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connections Modal */}
      {showConnections && (
        <ProfileConnections
          profileData={profileData}
          profileId={profileId}
          onClose={() => setShowConnections(false)}
        />
      )}
    </div>
  );
}

export default Profile;
