import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { login, logout } from "../store/authSlice";
import {
  Loader,
  Communities,
  GroupChat,
  Chats,
  Notifications,
} from "../components";
import { setVars } from "../store/varSlice";

function ChatPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chatId } = useParams();
  const [reload, setReload] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isUnreadNotification, setIsUnreadNotification] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const selectChat = useSelector((state) => state.vars.selectChat);

  useEffect(() => {
    const unsubscribe = userAuth.auth.onAuthStateChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const user = await dbServices.getDocument(
              "users",
              firebaseUser.uid
            );
            if (user) {
              user.uid = firebaseUser.uid;
              dispatch(login({ userData: user }));
            }
            const isUnreadNotification =
              await dbServices.checkUnreadNotification(firebaseUser.uid);
            setIsUnreadNotification(isUnreadNotification);
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
    if (!userData) return;
    async function fetchChatData() {
      const isChatExist = await dbServices.checkChatExists(
        chatId,
        userData.uid
      );
      if (isChatExist) {
        dispatch(setVars({ selectChat: chatId }));
      } else {
        navigate("/chats");
      }
    }
    fetchChatData();
  }, [chatId, userData, dispatch, navigate]);

  const handleLogout = async () => {
    try {
      await userAuth.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  if (!userData) {
    return <Loader />;
  }

  return (
    <div
      className="flex w-full min-h-screen justify-start bg-black text-gray-100 h-[100vh] overflow-scroll scrollbar-hide"
      onClick={() => setShowNotifications(false)}
    >
      {/* Left Sidebar */}

      <div
        className={`"w-[10px] min-w-[200px] h-[100vh] bg-gray-800/80 p-4 space-y-4 border-r border-gray-700/50 backdrop-blur-md 
        ${
          showMenu ? "translate-x-0" : "-translate-x-[70%]"
        } transition-transform duration-300"`}
      >
        <div
          className="flex  justify-around mb-8 text-xl font-bold text-gray-100 border-b border-gray-700/50 pb-4 shadow-lg cursor-pointer"
          onClick={() => setReload((prev) => !prev)}
        >
          <span>NESMO connect</span>
          {/* <div className="h-8 w-8" onClick={
            () => setShowMenu(!showMenu)
          }>
            <img src="/menu3.svg" />
          </div> */}
        </div>
        <div className="space-y-2 overflow-scroll scrollbar-hide bg-gray-900 p-2 rounded-lg shadow-lg border border-black">
          {<Chats />}
        </div>

        <Communities />
      </div>

      {/* Main Content Area */}
      <div
        className={`w-[100%] bg-black-900/95 backdrop-blur-sm h-full overflow-clip
          bg-black`}
      >
        {/* Navbar */}
        <div className="bg-gray-800/80 sticky top-0 z-10 shadow-lg p-2 flex justify-between items-center rounded-sm border-b border-gray-600/50 backdrop-blur-sm">
          <div
            className="text-lg font-semibold text-gray-100 cursor-pointer hover:bg-gray-700 rounded-lg p-1 transition-all duration-200 hover:scale-105"
            onClick={() => navigate("/")}
          >
            <span>
              <img src="/home.svg" className="h-8 w-8" />
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div
              onClick={handleLogout}
              className="cursor-pointer bg-gray-700/50 hover:bg-gray-600/60 rounded-xl px-3 py-1.5 transition-all duration-200 text-sm flex items-center gap-1.5 hover:ring-1 hover:ring-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </div>
            <button
              className="p-2 hover:bg-gray-700/50 rounded-full size-12 transition-all duration-200 relative"
              onClick={(e) =>
                setShowNotifications((prev) => {
                  e.stopPropagation();
                  return !prev;
                })
              }
            >
              <img
                src={
                  isUnreadNotification
                    ? "/notification-active.svg"
                    : "/notification.svg"
                }
                alt=""
                className="w-6 h-6 mx-auto transition-transform hover:scale-110"
              />
              {userData.notifications?.length > 0 && (
                <div className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full ring-1 ring-red-400"></div>
              )}
            </button>
            <div
              className="h-9 w-9 rounded-full ring-2 ring-gray-600/80 hover:ring-green-500 cursor-pointer transition-all overflow-hidden"
              onClick={() => navigate("/profile/" + userData.uid)}
            >
              <img
                src={userData?.avatarUrl || "/avatar.png"}
                alt="profile"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        {showNotifications && (
          <div className="bg-gray-800/80 w-[40%] border border-gray-700/50 rounded-xl shadow-xl p-1 backdrop-blur-sm fixed top-20 right-4 z-50">
            <Notifications userId={userData.uid} />
          </div>
        )}

        {/* Main Content */}
        <div className="flex justify-around p-4 gap-4 h-[90vh] sticky top-20">
          {selectChat && userData ? (
            <GroupChat
              chatId={selectChat}
              userData={userData}
              key={selectChat}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-300">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
