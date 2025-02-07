import React from "react";
import { useSelector } from "react-redux";

function Chat() {
  return (
    <div className="flex items-center space-x-6 p-2 hover:bg-gray-800/60 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-700 backdrop-blur-sm shadow-sm hover:shadow-green-500/5">
      <div className="h-8 w-8 rounded-full bg-green-500/90 ring-2 ring-green-600/50 hover:ring-green-400 transition-all">
        {/* Add avatar image if available */}
      </div>
      <div className="flex-1 min-w-0 ">
        <div className="font-medium text-gray-100 hover:text-green-400 transition-colors truncate">
          Jane Smith
        </div>
        <div className="text-sm text-gray-400/90 hover:text-gray-300 transition-colors truncate">
          Hey, how are you?
        </div>
      </div>
    </div>
  );
}

function Chats() {
  const userData = useSelector((state) => state.auth.userData);
  const chats = [];
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg shadow-black/40 border border-gray-800 overflow-scroll scrollbar-hide max-h-[40vh] p-3">
      {chats.length > 0 ? (
        <div className="space-y-1.5">
          {chats.map((chat) => (
            <Chat key={chat.id} chat={chat} />
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
  );
}

export default Chats;
