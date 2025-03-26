import React, { useState } from "react";
import { Chats, Connections, UserList } from "./";

function RightSidebar() {
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const sidebarItems = [
    {
      name: "Chats",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      component: <Chats />,
    },
    {
      name: "Connections",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      component: <Connections />,
    },
    {
      name: "Users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      component: <UserList />,
    },
  ];

  return (
    <div
      className={`sticky top-20 h-[90vh] rounded-xl max-w-[90%] bg-gray-800/80 border-l border-gray-700/50 backdrop-blur-md p-2 flex flex-col transition-all duration-300 overflow-auto`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarHidden(!sidebarHidden)}
        className="p-3 hover:bg-gray-700/50 transition-colors duration-200 flex items-center justify-center"
      >
        {sidebarHidden ? (
          <svg
            className="w-6 h-6"
            fill="white"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="white"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </button>

      {!sidebarHidden ? (
        <div className="flex flex-col h-full w-auto space-y-4 px-2 pb-4">
          <div className="space-y-4 h-full overflow-y-auto w-auto scrollbar-hide">
            {sidebarItems.map((item) => (
              <div key={item.name}>{item.component}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 px-2 pt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              className="p-2.5 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-all duration-200 text-gray-300 hover:text-gray-100"
              title={item.name}
            >
              {item.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default RightSidebar;
