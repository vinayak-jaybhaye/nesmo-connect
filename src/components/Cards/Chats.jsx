import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setVars } from "../../store/varSlice";
import dbServices from "../../firebase/firebaseDb";
import { useNavigate } from "react-router-dom";

function Chat({ chat, name }) {
  const dispatch = useDispatch();
  const selectChat = useSelector((state) => state.vars.selectChat);
  const navigate = useNavigate();

  return (
    <div
      className={`flex items-center space-x-6 p-2 hover:bg-gray-800/60 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-700 backdrop-blur-sm shadow-sm hover:shadow-green-500/5 ${
        selectChat === chat.id ? "bg-gray-600/60" : ""
      } `}
      onClick={() => {
        dispatch(setVars({ selectChat: null }));

        setTimeout(() => {
          dispatch(setVars({ selectChat: chat.id }));
          navigate(`/chats/${chat.id}`);
        }, 50);
      }}
    >
      <div className="h-7 w-7 rounded-full">
        <img src="/chat.svg" />
      </div>
      <div className="flex-1 min-w-0 ">
        <div
          className={`font-medium text-gray-100 hover:text-green-400 transition-colors truncate ${
            selectChat === chat.id ? "text-green-400" : ""
          }`}
        >
          {chat.name[0] === name ? chat.name[1] : chat.name[0]}
        </div>
      </div>
    </div>
  );
}

function Chats() {
  const [chats, setChats] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  useEffect(() => {
    async function fetchChats() {
      const chats = await dbServices.getAllChats(userData.uid);
      setChats(chats);
    }
    fetchChats();
  }, [userData.chats]);
  return (
    <>
      <h2 className="text-sm font-bold mb-4 text-gray-100 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-blue-500"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
          <path
            strokeLinecap="round"
            d="M17 6h-2.5a1.5 1.5 0 000 3h1a1.5 1.5 0 011.5 1.5V12"
          />
        </svg>
        Recent conversations
      </h2>
      <div className="bg-gray-900 rounded-lg shadow-lg shadow-black/40 border border-gray-800 overflow-scroll scrollbar-hide max-h-[40vh] p-3">
        {chats.length > 0 ? (
          <div className="space-y-1.5">
            {chats.map((chat) => (
              <Chat key={chat.id} chat={chat} name={userData.name} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 animate-pulse">
            <p className="text-gray-400/80 italic mb-2 flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              No recent conversations
            </p>
            <p className="text-sm text-gray-500">
              Start conversations with your network!
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Chats;
