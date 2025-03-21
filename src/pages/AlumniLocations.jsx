import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlumniList, AlumniMap } from "../components";
import firebaseDb from "../firebase/firebaseDb";

function AlumniLocations() {
  const navigate = useNavigate();
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
      const alumniUsers = await firebaseDb.getAllAlumni();
      setUsers(alumniUsers);
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex gap-4 p-2 w-full rounded-xl h-[90vh] bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm shadow-inner overflow-auto">
      {/* Left Side - User List */}
      <div className="bg-gray-800/70 backdrop-blur-sm p-2 rounded-2xl shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
        <div className="overflow-y-auto h-[calc(100vh-9rem)] scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/70 hover:scrollbar-thumb-gray-500/80 scrollbar-rounded-full">
          <AlumniList
            users={users}
            handleHighlight={handleHighlight}
            className="hover:text-white transition-colors"
          />
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="flex-1 h-full bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all overflow-auto">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-700/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="skyblue"
            fill="none"
          >
            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
          </svg>
          <h2 className="text-md font-bold text-white bg-clip-text">
            Global Network
          </h2>
        </div>
        <AlumniMap
          users={users}
          highlightedUser={highlightedLocation}
          className="rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all h-[calc(100vh-9rem)]"
        />
      </div>
    </div>
  );
}

export default AlumniLocations;
