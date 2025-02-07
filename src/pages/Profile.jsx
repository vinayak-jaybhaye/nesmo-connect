import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { login, logout } from "../store/authSlice";
import { Loader } from "../components";

import appwriteStorage from "../appwrite/appwriteStorage";

function Profile() {
  const { profileId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [amIOwner, setAmIOwner] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profile = await dbServices.getDocument("users", profileId);
        setProfileData(profile);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [profileId]);

  useEffect(() => {
    if (userData) {
      setAmIOwner(profileId === userData.uid);
    }
  }, [userData]);

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

  const handleLogout = async () => {
    try {
      await userAuth.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const handleEditProfile = () => {};

  const handleConnect = async () => {
    // Send connection request
        const req = await dbServices.sendConnectionRequest(userData, profileId);

  };

  //edit profile image and cover
  const renderEditButton = useCallback(
    (img) => {
      return amIOwner ? (
        <div
          className="absolute h-12 w-12 right-5 bottom-5 cursor-pointer bg-green-500 rounded-full p-2 border border-gray-800"
          onClick={() => handleChangeImage(img)}
        >
          <img src="/editImg.svg" alt="Edit" />
        </div>
      ) : null;
    },
    [amIOwner]
  );

  //edit profile
  const renderEditProfile = useCallback(() => {
    return amIOwner ? (
      <button
        className="w-full md:w-[30%] h-fit px-6 py-2 bg-[#181818] border border-gray-600 text-gray-100 rounded-full hover:bg-gray-600 transition mt-4 md:mt-0"
        onClick={() => navigate(`/edit-profile/${userData.uid}`)}
      >
        Edit Profile
      </button>
    ) : null;
  }, [amIOwner]);

  const renderConnectButton = useCallback(() => {
    const alreadyConnected = userData?.connections?.includes(profileId);
    return amIOwner ? null : (
      <button
        className="w-fit md:w-[30%] h-fit  py-2 bg-[#181818] border border-gray-600 text-gray-100 rounded-full hover:bg-gray-600 transition mt-4 md:mt-0"
        onClick={handleConnect}
        {...(alreadyConnected ? { disabled: true } : {})}
      > 
        {alreadyConnected ? "Connected" : "Connect"}
      </button>
    );
  }, [amIOwner]);

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

  return (
    <div className="flex flex-col lg:h-screen md:h-auto bg-black overflow-auto scrollbar-hide">
      {/* Banner Section */}
      <div className="flex h-[35%] bg-gray-800 overflow-hidden relative">
        <img
          src={profileData?.coverUrl || "/cover.png"}
          className="w-full h-[100%]  opacity-40"
          alt="Banner"
        />
        <>{renderEditButton("cover")}</>
        <div
          onClick={() => navigate("/")}
          className="absolute cursor-pointer bg-blue-500 rounded-lg px-2 late-600 m-5  hover:scale-105 hover:opacity-90 transition-all opacity-50"
        >
          Dashboard
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col lg:h-[65%] md:h-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row relative justify-end lg:items-center md:items-start h-auto md:h-[40%] lg:h-[40%] bg-gray-800 shadow-2xl p-4 md:p-6 ">
          {/* Profile Avatar */}
          <div className="absolute rounded-full h-33 w-33 md:h-[280px] md:w-[280px] -top-28  md:-top-36 left-1/2 md:left-20 transform -translate-x-1/2 md:translate-x-0 shadow-xl z-[1]">
            <img
              src={profileData?.avatarUrl || "avatar.png"}
              className="rounded-full w-full h-full object-cover"
              alt="Profile"
            />
            <>{renderEditButton("avatar")}</>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row w-full md:w-[65%] justify-between items-center md:items-start p-2 rounded-tl-xl mt-14 md:mt-0">
            <div className="w-full md:w-[70%] text-center md:text-left space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
                {profileData?.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="px-4 py-1 bg-blue-900 text-gray-100 rounded-full">
                  {profileData?.userRole || "User"}
                </span>
                {renderConnectButton()}
              </div>

              <div className="flex gap-5 text-gray-400 justify-center md:justify-start items-center pl-2">
                <a
                  href={profileData?.linkedin || "https://in.linkedin.com/"}
                  className="hover:text-blue-400"
                >
                  <img src="/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
                </a>
                <a
                  href={
                    `https://mail.google.com/mail/?view=cm&fs=1&to=${profileData?.email}&su=Hello%20there&body=Hi%20there,%20I%20wanted%20to%20reach%20out%20about%20...` ||
                    "#"
                  }
                  className="hover:text-blue-400"
                >
                  <img src="/gmail.svg" alt="Email" className="w-6 h-6" />
                </a>
                <a
                  href={profileData?.twitter || "https://x.com/home?lang=en"}
                  className="hover:text-blue-400"
                >
                  <img src="/twitter.svg" alt="Twitter" className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div className=" flex flex-col size-full items-end p-2">
              {renderEditProfile()}
              <div
                onClick={() => navigate("/")}
                className="cursor-pointer size-fit bg-blue-300 rounded-lg px-2 y-1 late-600 m-5  hover:scale-105 transition-all"
              >
                To Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-gray-900 p-4 flex flex-col justify-evenly shadow-2xl h-[60%]">
          <div className="py-2 flex flex-col justify-evenly overflow-auto scrollbar-hide">
            <div className="flex flex-col md:flex-row justify-around text-gray-100 text-center md:text-left space-y-4 md:space-y-0 p-2">
              <div className="space-y-2">
                <div>
                  <label className="text-gray-400 text-sm">Education</label>
                  <p className="font-medium">
                    {profileData?.education || "Not Specified"}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Location</label>
                  <p className="font-medium">
                    {profileData?.location || "Not Specified"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">
                  Current Position
                </label>
                <p className="font-medium">
                  {profileData?.position || "not specified"}
                </p>
              </div>
            </div>

            <div className="space-y-2 px-4 md:pl-10">
              <h2 className="text-xl font-semibold text-gray-100">About</h2>
              <div className="overflow-auto scrollbar-hide p-2">
                <p className="text-gray-400 max-h-[40vh] leading-relaxed">
                  {profileData?.about ||
                    "User has not provided any information about themselves"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
