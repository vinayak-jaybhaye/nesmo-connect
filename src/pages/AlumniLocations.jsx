import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlumniList, AlumniMap } from "../components";
import firebaseDb from "../firebase/firebaseDb";

function AlumniLocations() {
  const [users, setUsers] = useState([]);
  const [highlightedLocation, setHighlightedLocation] = useState(
    [20.5937, 78.9629],
    null
  );

  const handleHighlight = (user) => {
    if (user?.personalData?.location) {
      const { latitude, longitude } = user.personalData?.location;
      setHighlightedLocation({
        location: [latitude, longitude],
        userId: user.id,
      });
    } else {
      setHighlightedLocation({ userId: user.id, location: [20.5937, 78.9629] });
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await firebaseDb.getAllDocuments("users");
      setUsers(usersCollection);
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen gap-4 p-4 bg-gray-900 text-gray-100">
      {/* Left Side - User List */}
      <div className="w-1/3 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-300 pb-2 border-b border-gray-700">
          Alumni List
        </h2>
        <div className="overflow-y-auto h-[calc(100vh-7rem)]">
          <AlumniList
            users={users}
            handleHighlight={handleHighlight}
            className="hover:text-white transition-colors"
          />
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="flex-1 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-300 pb-2 border-b border-gray-700">
          Alumni Map
        </h2>
        <AlumniMap
          users={users}
          highlightedUser={highlightedLocation}
          className="rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
}

export default AlumniLocations;
