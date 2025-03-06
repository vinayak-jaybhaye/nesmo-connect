import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultCenter = [20.5937, 78.9629]; // India

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const highlightedIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [30, 50],
  iconAnchor: [15, 50],
});

// 👇 MapController component to move/zoom the map when highlightedUser changes
const MapController = ({ highlightedUser }) => {
  const map = useMap();

  useEffect(() => {
    if (highlightedUser && highlightedUser.location) {
      const [lat, lng] = highlightedUser.location;
      map.setView([lat, lng], 10); // 10 is zoom level, adjust if needed
    }
  }, [highlightedUser, map]);

  return null; // this component only acts as a controller
};

const AlumniMap = ({ users, highlightedUser }) => {
  const navigate = useNavigate();
  let highlightedMarker = null;

  const markers = [];

  users.forEach((alumnus, index) => {
    const isHighlighted = alumnus.id === highlightedUser?.userId;

    const marker = (
      <Marker
        key={index}
        position={
          alumnus?.personalData?.location
            ? [
                alumnus.personalData.location.latitude,
                alumnus.personalData.location.longitude,
              ]
            : defaultCenter
        }
        icon={isHighlighted ? highlightedIcon : defaultIcon}
      >
        <Popup>
          <img
            src={alumnus?.avatarUrl || "avatar.png"}
            className="w-20"
            onClick={() => navigate(`/profile/${alumnus.id}`)}
          />
          <strong>{alumnus?.name || "Alumnus"}</strong>
          <br />
          Batch: {alumnus?.personalData?.batch}
        </Popup>
      </Marker>
    );

    if (isHighlighted) {
      highlightedMarker = marker; // store highlighted marker separately
    } else {
      markers.push(marker); // collect normal markers
    }
  });

  return (
    <div className="w-full h-[calc(100vh-120px)] rounded-lg overflow-hidden shadow-md">
      <MapContainer center={defaultCenter} zoom={5} className="w-full h-full">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {/* This handles zoom/center logic */}
        <MapController highlightedUser={highlightedUser} />

        {markers}
        {highlightedMarker}
      </MapContainer>
    </div>
  );
};

export default AlumniMap;
