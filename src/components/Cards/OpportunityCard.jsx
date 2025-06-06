import React from "react";
import { format } from "date-fns";
import { FaSuitcase, FaUserCircle, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import dbServices from "../../firebase/firebaseDb";
import appwriteStorage from "../../appwrite/appwriteStorage";

import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";

function OpportunityCard({ opportunity, onDelete }) {
  const user = useSelector((state) => state.auth.userData);
  const isCreator = user?.uid === opportunity.createdBy?.id;

  const Navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      try {
        if (opportunity.imageUrl) {
          try {
            await appwriteStorage.deleteFile(opportunity.fileId);
          } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete opportunity image");
            return;
          }
        }
        await dbServices.deleteOpportunity(opportunity.id);
        onDelete?.(opportunity.id);
      } catch (error) {
        console.error("Error deleting opportunity:", error);
        alert("Failed to delete opportunity");
      }
    }
  };

  return (
    <div className="group h-full w-full relative bg-black shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out hover:-translate-y-1 border border-gray-700/50 hover:border-gray-600/50">
      {/* Content Section */}
      <div className="space-y-4 p-2 rounded-md">
        {/* Header */}
        <div
          className="flex-col items-start justify-between pl-4 cursor-pointer"
          onDoubleClick={() => Navigate(`/opportunity/${opportunity.id}`)}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl shadow-lg">
              <FaSuitcase className="text-2xl text-blue-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100 pr-2">
              {opportunity.title}
            </h3>
          </div>
          <span className="text-sm text-gray-400/90 mt-1.5">
            {format(opportunity?.createdAt?.toDate(), "MMM dd, yyyy")}
          </span>
        </div>

        {/* Actual content */}
        <div className="max-h-[50vh] overflow-auto pl-8">
          {/* Image Section */}
          {opportunity.imageUrl && (
            <div className="mb-4 overflow-auto rounded-sm border border-gray-700/50 group-hover:border-gray-600/50 transition-all">
              <img
                src={opportunity.imageUrl}
                alt={opportunity.title}
                className="object-cover transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}

          {/* Description */}
          <pre className="text-gray-300/85 bg-black leading-relaxed text-lg border-l-4 border-blue-500/30 pl-4 ml-2 italic font-light whitespace-pre-wrap overflow-auto">
            {opportunity.description}
          </pre>
        </div>

        {/* Author Section */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              {opportunity.createdBy?.avatarUrl ? (
                <img
                  src={opportunity.createdBy.avatarUrl}
                  alt={opportunity.createdBy.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-500/30 hover:border-blue-400/50 transition-all"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-400 hover:text-blue-400/80 transition-colors" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400">Posted by</p>
              <p className="font-medium text-gray-200">
                {opportunity.createdBy?.name || "Anonymous"}
              </p>
            </div>
          </div>
          {/* Delete Button */}
          {isCreator && (
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-gray-500/30 text-red-600  rounded-lg backdrop-blur-sm transition-all shadow-sm hover:shadow-red-500/20"
              title="Delete opportunity"
            >
              {/* <FaTrash className="text-lg" /> */}
              {/* <img src="delete.svg" className="h-5 w-5" /> */}
              <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OpportunityCard;
