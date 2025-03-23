import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AlumniList({ users, handleHighlight }) {
  const navigate = useNavigate();
  const [listHidden, setListHidden] = useState(false);

  return (
    <div className="h-full overflow-auto">
      <div className="flex gap-4 items-center justify-around mb-4 p-2">
        {!listHidden && (
          <h2 className="text-lg font-bold text-gray-100 flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-green-400 hover:text-green-300 transition-colors"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Connect to more people
          </h2>
        )}
        <div
          className="hidden md:block cursor-pointer"
          onClick={() => setListHidden(!listHidden)}
        >
          {!listHidden ? (
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
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/90 rounded-xl shadow-2xl shadow-black/30 overflow-hidden border border-gray-700/60">
        <div className="flex flex-col gap-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="group bg-gray-800/50 hover:bg-gray-700/60 backdrop-blur-sm 
              rounded-xl p-1 transition-all duration-300 cursor-pointer
              border border-gray-700/40 hover:border-green-400/30
              shadow-md hover:shadow-green-400/20 hover:-translate-y-0.5"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 relative">
                  <div
                    className="h-14 w-14 rounded-full ring-2 ring-gray-500/80 group-hover:ring-green-400 
                    transition-all duration-300 hover:scale-105"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <img
                      src={user.avatarUrl || "avatar.png"}
                      className="rounded-full size-full object-cover transform transition duration-300 hover:scale-105"
                      alt={user.name}
                      onError={(e) => (e.target.src = "avatar.png")}
                    />
                  </div>
                </div>

                {!listHidden && (
                  <div
                    className="flex-1 min-w-0 space-y-1"
                    onClick={() => handleHighlight(user)}
                  >
                    <h2
                      className="text-lg font-semibold truncate text-gray-100 
                    group-hover:text-green-300 transition-colors duration-200"
                    >
                      {user.name || "Unknown User"}
                    </h2>
                    <p
                      className="text-sm truncate text-gray-400/80 group-hover:text-gray-200 
                    transition-colors duration-200 font-mono"
                    >
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 animate-pulse">
            <p
              className="text-gray-400/80 italic flex items-center justify-center gap-3 
              text-lg font-light"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 text-green-400/50 animate-float"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
              No users found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlumniList;
