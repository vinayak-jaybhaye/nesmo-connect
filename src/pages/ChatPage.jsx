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
  const userData = useSelector((state) => state.auth.userData);
  const selectChat = useSelector((state) => state.vars.selectChat);
  const [showChat, setShowChat] = useState(false);

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

  if (!userData) {
    return <Loader />;
  }

  return (
    <div className="flex h-[90vh] w-full gap-2 justify-start text-gray-100 overflow-scroll scrollbar-hide">
      {/* Left Sidebar */}
      <div
        className={`${
          selectChat && "hidden"
        } md:block bg-gray-800/80 w-full md:w-fit rounded-md space-y-4 border-r border-gray-700/50 backdrop-blur-md
        ${
          showMenu ? "translate-x-0" : "-translate-x-[70%]"
        } transition-transform duration-300`}
      >
        <div className="space-y-2 overflow-scroll scrollbar-hide bg-gray-900 p-2 rounded-lg shadow-lg border border-black">
          {<Chats />}
        </div>

        <Communities />
      </div>

      {/* Main Content Area */}
      <div
        className={`${
          !selectChat && "hidden"
        } w-full bg-black-900/95 backdrop-blur-sm h-full overflow-clip
          bg-black rounded-md `}
      >
        {/* Main Content */}
        <div className="flex justify-around p-2 h-[90%] md:h-full sticky">
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
