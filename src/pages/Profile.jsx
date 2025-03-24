import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch, connect } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { login, logout } from "../store/authSlice";
import { setVars } from "../store/varSlice";
import { Loader, ProfileConnections } from "../components";

import { generateChatId } from "../utils/helper";

import appwriteStorage from "../appwrite/appwriteStorage";

function Profile() {
  const { profileId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [amIOwner, setAmIOwner] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
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
      setShowConnections(false);
      try {
        const profile = await dbServices.getDocument("users", profileId);
        setProfileData(profile);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
    fetchConnectionStatus();
    setAmIOwner(profileId === userData?.uid);
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
  };

  if (!userData) {
    return <Loader />;
  }

  const handleChangeImage = async (img) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg, image/jpg, image/gif, image/webp";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
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

  if (!profileData) {
    return <Loader />;
  }

  return (
    <div
      className="flex flex-col h-full bg-black w-full overflow-auto scrollbar-hide"
      onClick={() => setShowConnections(false)}
    >
      {/* Banner Section */}
      <div className="h-48 sm:h-56 md:h-64 bg-gray-800 overflow-hidden relative opacity-80">
        <img
          src={profileData?.coverUrl || "/cover.png"}
          className="w-full h-full object-cover opacity-40"
          alt="Banner"
        />
        {amIOwner && (
          <div
            className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 h-6 w-6 sm:h-8 sm:w-8 bg-green-500 rounded-full p-1 border border-gray-800 cursor-pointer"
            onClick={() => handleChangeImage("cover")}
          >
            <img src="/editImg.svg" alt="Edit" className="w-full h-full" />
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Profile Header */}
        <div className="relative flex flex-col items-center  md:flex-row md:items-start md:justify-end px-4 pt-20 md:pt-2 pb-6 bg-gradient-to-r from-blue-800/80 to-indigo-900/80">
          {/* Profile Avatar */}
          <div className="absolute -top-16 md:-top-24 left-1/2 md:left-6 transform -translate-x-1/2 md:translate-x-0 w-32 h-32 md:w-48 md:h-48 border-4 border-white/20 rounded-full shadow-2xl z-[1]">
            <img
              src={profileData?.avatarUrl || "/avatar.png"}
              className="rounded-full w-full h-full object-cover"
              alt="Profile"
            />
            {amIOwner && (
              <div
                className="absolute bottom-0 right-4 h-6 w-6 md:h-8 md:w-8 bg-green-500 rounded-full p-1 border border-gray-800 cursor-pointer"
                onClick={() => handleChangeImage("avatar")}
              >
                <img src="/editImg.svg" alt="Edit" className="w-full h-full" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="w-full md:w-[70%] flex flex-col md:flex-row items-center md:items-start justify-between md:justify-center lg:justify-between mt-4 md:mt-0 space-y-4 md:space-y-0">
            <div className="w-full md:w-[60%] text-center md:text-left space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {profileData?.name}
                </h1>
                {!amIOwner && (
                  <button
                    className="p-1 hover:scale-110 transition-transform"
                    onClick={handleMessage}
                  >
                    <img src="/chat.svg" alt="Chat" className="w-6 h-6" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md text-sm">
                  {profileData?.userRole || "User"}
                </span>
                {!amIOwner && (
                  <button
                    className={`px-4 py-1 bg-gray-800 border border-gray-600 text-gray-100 rounded-full hover:bg-gray-700 text-sm ${
                      connectionStatus === "received" ? "bg-gray-700" : ""
                    }`}
                    onClick={() => handleConnect(profileData)}
                    disabled={["sent", "received", "connected"].includes(
                      connectionStatus
                    )}
                  >
                    {connectionStatus || "Connect"}
                  </button>
                )}
                <button
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConnections(!showConnections);
                  }}
                >
                  Connections
                </button>
              </div>

              <div className="flex justify-center md:justify-start gap-3">
                {profileData.personalData?.linkedin && (
                  <a
                    href={profileData.personalData.linkedin}
                    className="hover:scale-110"
                  >
                    <img
                      src="/linkedin.svg"
                      alt="LinkedIn"
                      className="w-6 h-6"
                    />
                  </a>
                )}
                {/* Add similar conditional rendering for other social links */}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 w-full md:w-auto">
              {amIOwner && (
                <button
                  className="w-full md:w-32 px-4 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md hover:bg-gray-700 text-sm"
                  onClick={() => navigate(`/edit-profile/${userData.uid}`)}
                >
                  Edit Profile
                </button>
              )}
              <button
                className="w-full md:w-32 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg text-sm hover:scale-105"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <label className="text-blue-400 text-sm">Education</label>
              <p className="text-white mt-1">
                {profileData?.personalData?.education || "Not Specified"}
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <label className="text-blue-400 text-sm">Location</label>
              <p className="text-white mt-1">
                {profileData?.personalData?.city || "Not Specified"}
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <label className="text-blue-400 text-sm">Current Position</label>
              <p className="text-white mt-1">
                {profileData?.personalData?.position || "Not Specified"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Bio</h2>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-300 leading-relaxed">
                {profileData?.personalData?.about || "No bio provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

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
