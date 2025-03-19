import React from "react";
import { format } from "date-fns";
import { FaTrophy, FaUserCircle, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import dbServices from "../../firebase/firebaseDb";
import appwriteStorage from "../../appwrite/appwriteStorage";

function AchievementCard({ achievement, onDelete }) {
  const user = useSelector((state) => state.auth.userData);
  const isCreator = user?.uid === achievement.createdBy?.id;

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
    <div className="group flex-1  max-w-[50%] min-w-[30%] h-96 relative p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out hover:-translate-y-1 border border-gray-700/50 hover:border-gray-600/50 overflow-auto backdrop-blur-sm">
      {/* Image Section */}
      {achievement.imageUrl && (
        <div className="mb-6 -mx-2 overflow-hidden rounded-xl border border-gray-700/50 group-hover:border-gray-600/50 transition-all">
          <img
            src={achievement.imageUrl}
            alt={achievement.title}
            className="w-full h-60 object-cover transform transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-xl shadow-lg">
              <FaTrophy className="text-2xl text-amber-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100 pr-2">
              {achievement.title}
            </h3>
          </div>
          <span className="text-sm text-gray-400/90 mt-1.5">
            {format(achievement?.createdAt?.toDate(), "MMM dd, yyyy")}
          </span>
        </div>

        {/* Description */}
        <pre className="text-gray-300/85 leading-relaxed text-lg border-l-4 border-amber-500/30 pl-4 ml-2 italic font-light whitespace-pre-wrap overflow-x-auto">
          {achievement.description}
        </pre>

        {/* Author Section */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              {achievement.createdBy?.avatarUrl ? (
                <img
                  src={achievement.createdBy.avatarUrl}
                  alt={achievement.createdBy.name}
                  className="w-10 h-10 rounded-full border-2 border-amber-500/30 hover:border-amber-400/50 transition-all"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-400 hover:text-amber-400/80 transition-colors" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400">Achieved by</p>
              <p className="font-medium text-gray-200">
                {achievement.createdBy?.name || "Anonymous"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      {isCreator && (
        <button
          onClick={handleDelete}
          className="absolute bottom-6 right-6 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400/90 hover:text-red-300 rounded-lg backdrop-blur-sm transition-all shadow-sm hover:shadow-red-500/20"
          title="Delete achievement"
        >
          <FaTrash className="text-lg" />
        </button>
      )}
    </div>
  );
}

export default AchievementCard;
