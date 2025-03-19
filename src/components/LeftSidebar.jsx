import React from "react";
import { useNavigate } from "react-router-dom";
import { Communities } from "../components";

function LeftSidebar({ userData }) {
  const navigate = useNavigate();

  return (
    <div className="w-[25%] sticky top-16 min-w-[200px] h-[90vh] rounded-xl bg-gray-800/80 p-4 space-y-4 border-r border-gray-700/50 backdrop-blur-md">
      {/* Navigation Menu */}
      <div className="space-y-2 overflow-scroll scrollbar-hide bg-gray-900 p-2 rounded-lg shadow-lg border border-black">
        {[
          { name: "Home", action: () => navigate("/") },
          { name: "Achievements", action: () => navigate("/achievements") },
          { name: "Opportunities", action: () => navigate("/opportunities") },
          { name: "Alumni Listing", action: () => navigate("/all-users") },
          { name: "About Us", action: () => navigate("/about-us") },
        ].map((item) => (
          <div
            key={item.name}
            onClick={item.action}
            className="p-2.5 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-all duration-200 text-gray-300 hover:text-gray-100 flex items-center gap-2"
          >
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Communities Section */}
      <Communities />
    </div>
  );
}

export default LeftSidebar;
