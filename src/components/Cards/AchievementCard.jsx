import React, { useState } from "react";
import { format } from "date-fns";
import { FaTrophy, FaUserCircle, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import dbServices from "../../firebase/firebaseDb";
import appwriteStorage from "../../appwrite/appwriteStorage";
import { useNavigate } from "react-router-dom";

import { Trash } from "lucide-react";

function AchievementCard({ achievement, onDelete }) {
  const user = useSelector((state) => state.auth.userData);
  const [showAchievementContent, setShowAchievementContent] = useState(false);
  const isCreator = user?.uid === achievement.createdBy?.id;

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        if (achievement.imageUrl) {
          try {
            await appwriteStorage.deleteFile(achievement.fileId);
          } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete achievement image");
            return;
          }
        }
        await dbServices.deleteAchievement(achievement.id);
        onDelete?.(achievement.id);
      } catch (error) {
        console.error("Error deleting achievement:", error);
        alert("Failed to delete achievement");
      }
    }
  };

  return (
    <div className="group h-full w-full relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out hover:-translate-y-1 border-b md:border border-gray-700/50 hover:border-gray-600/50">
      {/* Content Section */}
      <div className="space-y-2 md:space-y-4 bg-slate-950 p-2 rounded-md">
        {/* Header */}
        <div
          className="flex flex-col justify-between gap-2 pl-4 cursor-pointer"
          onDoubleClick={() => navigate(`/achievement/${achievement.id}`)}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-amber-500/20 rounded-lg md:rounded-xl shadow">
              <FaTrophy className="text-xl md:text-2xl text-amber-400 animate-pulse" />
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-100 break-words">
              {achievement.title}
            </h3>
          </div>
          <span className="text-xs md:text-sm text-gray-400/90">
            {format(achievement?.createdAt?.toDate(), "MMM dd, yyyy")}
          </span>
        </div>

        {/* Actual content */}
        <div
          className={`${
            showAchievementContent ? "" : "max-h-[50vh]"
          } overflow-auto pl-8`}
        >
          {/* Image Section */}
          {achievement.imageUrl && (
            <div className="mb-4 md:mb-6 overflow-auto rounded-lg md:rounded-xl border border-gray-700/50 group-hover:border-gray-600/50 transition-all">
              <img
                src={achievement.imageUrl}
                alt={achievement.title}
                className="object-cover transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}

          {/* Description */}
          <pre
            className={`text-sm md:text-base bg-black text-gray-300/85 leading-relaxed border-l-2 md:border-l-4 border-amber-500/30 pl-2 md:pl-4 ml-1 md:ml-2 italic font-light whitespace-pre-wrap overflow-auto`}
            onClick={() => setShowAchievementContent(!showAchievementContent)}
          >
            {achievement.description}
          </pre>
        </div>

        {/* Author Section */}
        <div className="flex items-center justify-between mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              {achievement.createdBy?.avatarUrl ? (
                <img
                  src={achievement.createdBy.avatarUrl}
                  alt={achievement.createdBy.name}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-amber-500/30 hover:border-amber-400/50 transition-all"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 md:w-10 md:h-10 text-gray-400 hover:text-amber-400/80 transition-colors" />
              )}
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-400">Achieved by</p>
              <p
                className="text-sm md:text-base font-medium text-gray-200"
                onClick={() =>
                  navigate(`/profile/${achievement.createdBy?.id}`)
                }
              >
                {achievement.createdBy?.name || "Anonymous"}
              </p>
            </div>
          </div>
          {/* Delete Button */}
          {isCreator && (
            <button
              onClick={handleDelete}
              className=" md:bottom-4 md:right-4 p-1.5 md:p-2  hover:bg-gray-500/30 text-red-600 rounded-md md:rounded-lg backdrop-blur-sm transition-all shadow-sm hover:shadow-red-500/20"
              title="Delete achievement"
            >
              {/* <FaTrash className="text-base md:text-lg" /> */}
              <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AchievementCard;
