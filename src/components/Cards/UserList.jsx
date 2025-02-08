import React, { useState, useEffect } from "react";
import firebaseDb from "../../firebase/firebaseDb";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await firebaseDb.getAllDocuments("users");
      setUsers(usersCollection);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <h2 className="text-sm font-bold mb-4 text-gray-100 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-green-500"
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
      <div className="h-auto bg-gray-900 rounded-lg shadow-lg shadow-black/40 overflow-scroll scrollbar-hide max-h-[40vh] border border-gray-800">
        <div className="flex flex-col gap-2 p-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm 
            rounded-lg p-2 transition-all duration-200 cursor-pointer
            border border-gray-700/50 hover:border-gray-600
            shadow-sm hover:shadow-green-500/10"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full ring-2 ring-gray-600 hover:ring-green-500 transition-all">
                    <img
                      src={user.avatarUrl || "avatar.png"}
                      className="rounded-full size-full object-cover"
                      alt={user.name}
                      onError={(e) => (e.target.src = "avatar.png")}
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-medium truncate text-gray-100 hover:text-green-400 transition-colors">
                    {user.name || "Unknown User"}
                  </h2>
                  <p className="text-sm truncate text-gray-400/90 hover:text-gray-300 transition-colors">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 animate-pulse">
            <p className="text-gray-400/80 italic flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
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
    </>
  );
}

export default UserList;
