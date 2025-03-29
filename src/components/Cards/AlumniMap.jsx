import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icons with optimized encoding
const createCustomIcon = (color = "%233B82F6", size = [32, 32]) => {
  const encodedSvg = `%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%0A%20%20%3Cpath%20d%3D%22M12%202C8.13%202%205%205.13%205%209c0%205.25%207%2013%207%2013s7-7.75%207-13c0-3.87-3.13-7-7-7zm0%209.5a2.5%202.5%200%200%201%200-5%202.5%202.5%200%200%201%200%205z%22%20fill%3D%22${color}%22%2F%3E%0A%3C%2Fsvg%3E`;

  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf-8,${encodedSvg}`,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [0, -size[1] / 1.5],
    shadowUrl: null,
    className: "leaflet-marker-icon",
  });
};

// Pre-create icons with proper color encoding
const defaultIcon = createCustomIcon("%233B82F6", [32, 32]); // Blue
const highlightedIcon = createCustomIcon("%2310B981", [50, 50]); // Green

const defaultCenter = [20.5937, 78.9629]; // India

const MapController = ({ highlightedUser }) => {
  const map = useMap();

  useEffect(() => {
    if (highlightedUser && highlightedUser.location) {
      const [lat, lng] = highlightedUser.location;
      map.flyTo([lat, lng], 12, {
        duration: 2,
        easeLinearity: 0.25,
      });
    }
  }, [highlightedUser, map]);

  return null;
};

const AlumniMap = ({ users, highlightedUser }) => {
  const navigate = useNavigate();
  // console.log("rendering map");

  return (
    <div className="w-full h-[90%] rounded-sm overflow-hidden shadow-2xl border-2 border-gray-700/50 bg-gray-900">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        className="w-full h-full bg-gray-900"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
          className="map-tiles"
        />

        <MapController highlightedUser={highlightedUser} />

        {users.map((alumnus) => {
          const position = alumnus?.personalData?.location
            ? [
                alumnus.personalData.location.latitude,
                alumnus.personalData.location.longitude,
              ]
            : defaultCenter;

          return (
            <Marker
              key={alumnus.id}
              position={position}
              icon={
                alumnus.id === highlightedUser?.userId
                  ? highlightedIcon
                  : defaultIcon
              }
            >
              <Popup className="!rounded-xl !border !border-gray-200 !bg-white !text-gray-800 shadow-xl">
                <div className="flex flex-col items-center gap-3 p-3 w-48">
                  <div className="relative group">
                    <img
                      src={alumnus?.avatarUrl || "avatar.png"}
                      className="w-20 h-20 rounded-full border-2 border-gray-200 hover:border-green-500 
                 transition-all duration-300 cursor-pointer object-cover
                 group-hover:scale-105 group-hover:shadow-md"
                      onClick={() => navigate(`/profile/${alumnus.id}`)}
                      onError={(e) => (e.target.src = "avatar.png")}
                      alt={alumnus.name}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-2 border-transparent 
                     group-hover:border-green-200 transition-all duration-300 pointer-events-none"
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-lg text-gray-800 truncate tracking-tight">
                      {alumnus?.name || "Alumnus"}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 text-sm">
                      <span className="text-gray-600 font-medium">Batch</span>
                      <span
                        className="px-2 py-0.5 bg-gray-100 rounded-md text-green-600 
                        font-mono tracking-tight shadow-inner"
                      >
                        {alumnus?.personalData?.batch || "N/A"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/profile/${alumnus.id}`)}
                    className="mt-1 px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white 
              rounded-lg text-sm font-medium transition-all duration-200
              flex items-center gap-2 hover:gap-3 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    View Profile
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AlumniMap;
