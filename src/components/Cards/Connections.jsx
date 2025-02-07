import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import defaultAvatar from "/avatar.png";
import { useNavigate } from "react-router-dom";

// Static empty array for consistent reference
const EMPTY_ARRAY = [];

function ConnectionItem({ connection }) {
  const navigate = useNavigate();
  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  return (
    <div
      className="flex items-center gap-3 p-3 border border-gray-700/50 bg-green-800/90 hover:bg-green-700/80 
               transition-all duration-200 cursor-pointer rounded-md backdrop-blur-sm
               shadow-sm hover:shadow-green-500/10 hover:border-gray-600"
      onClick={() => navigate("/profile/" + connection.other)}
    >
      <img
        src={connection.otherAvatar || defaultAvatar}
        alt={`${connection.otherName}'s avatar`}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-600 hover:ring-green-500 transition-all"
        onError={handleImageError}
        loading="lazy"
      />
      <span
        className="text-lg font-medium truncate text-gray-100 hover:text-green-400 transition-colors"
        title={connection.otherName}
      >
        {connection.otherName}
      </span>
    </div>
  );
}

ConnectionItem.propTypes = {
  connection: PropTypes.shape({
    other: PropTypes.string.isRequired,
    otherName: PropTypes.string.isRequired,
    otherAvatar: PropTypes.string,
  }).isRequired,
};

function Connections() {
  const connections = useSelector(
    (state) => state.auth.userData?.connections ?? EMPTY_ARRAY
  );

  return (
    <div className="p-4 bg-gray-900 shadow-lg shadow-black/40 rounded-lg border border-gray-800">
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
        Your Connections
      </h2>
      {connections.length > 0 ? (
        <div className="space-y-2 h-auto max-h-[40vh] overflow-scroll scrollbar-hide">
          {connections.map((connection) => (
            <ConnectionItem key={connection.other} connection={connection} />
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            No connections yet
          </p>
          <p className="text-sm text-gray-500">Start building your network!</p>
        </div>
      )}
    </div>
  );
}

export default Connections;
