import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlumniList, AlumniMap } from "../components";
import firebaseDb from "../firebase/firebaseDb";

function AlumniLocations() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [highlightedLocation, setHighlightedLocation] = useState(null);
  const [showList, setShowList] = useState(false);

  const handleHighlight = (user) => {
    if (user?.personalData?.location) {
      const { latitude, longitude } = user.personalData?.location;
      setHighlightedLocation({
        location: [latitude, longitude],
        userId: user.id,
      });
    } else {
      setHighlightedLocation((prev) => ({ ...prev, userId: user.id }));
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
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:p-2 w-full h-[90vh]">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setShowList(!showList)}
        className="md:hidden fixed bottom-16 right-4 z-10 p-3 bg-gray-700/80 rounded-full backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/50 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={showList ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Left Side - User List */}
      <div
        className={`${
          showList ? "block" : "hidden"
        } md:block bg-gray-800/70 backdrop-blur-sm p-2 rounded-xl border border-gray-700/50 transition-all`}
      >
        <div className="overflow-y-auto h-[300px] md:h-[calc(100vh-9rem)] scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/70">
          <AlumniList
            users={users}
            handleHighlight={handleHighlight}
            className="hover:text-white transition-colors"
          />
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="flex-1 h-[60vh] md:h-full bg-gray-800/70 backdrop-blur-sm p-2 md:p-4 rounded-xl border border-gray-700/50">
        <div className="flex items-center gap-2 md:gap-3 pb-2 md:pb-4 mb-2 md:mb-4 border-b border-gray-700/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 md:w-6 md:h-6"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="skyblue"
            fill="none"
          >
            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
          </svg>
          <h2 className="text-sm md:text-base font-semibold text-white">
            Global Network
          </h2>
        </div>
        <AlumniMap
          users={users}
          highlightedUser={highlightedLocation}
          className="rounded-lg md:rounded-xl border border-gray-700/50 h-[calc(100%-40px)]"
        />
      </div>
    </div>
  );
}

export default AlumniLocations;
