import React, { useState, useEffect } from "react";
import firebaseDb from "../../firebase/firebaseDb";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await firebaseDb.getAllDocuments("users");
      setUsers(usersCollection);
    };
    fetchUsers();
  }, []);

  return (
    <div className="h-[100%] w-[100%] bg-gray-900 p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8 border-b border-gray-700 pb-4">
        User List
      </h1>

      <div className="flex flex-col gap-4 w-[300px]">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full ">
                  <img
                    src={user.avatarUrl || "avatar.png"}
                    className="rounded-full size-full"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-medium truncate text-gray-100">
                  {user.name || "Unknown User"}
                </h2>
                <p className="text-sm truncate text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No users found</p>
        </div>
      )}
    </div>
  );
}

export default UserList;
