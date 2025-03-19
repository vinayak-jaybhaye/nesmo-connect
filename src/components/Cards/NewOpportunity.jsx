import React, { useState } from "react";
import appwriteStorage from "../../appwrite/appwriteStorage";
import dbServices from "../../firebase/firebaseDb";
import { useSelector } from "react-redux";
import { FaPlus, FaImage, FaPaperPlane, FaTimes } from "react-icons/fa";

function NewOpportunity() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const user = useSelector((state) => state.auth.userData);

  const handleOpportunityPost = async () => {
    if (title.trim() === "" || description.trim() === "") return;

    let imageUrl = null;
    let fileId = null;

    if (image) {
      const fileData = await appwriteStorage.uploadFile(image);
      fileId = fileData["$id"];

      const isWebP = image.type === "image/webp";
      imageUrl = isWebP
        ? appwriteStorage.getFileView(fileId)
        : appwriteStorage.getFilePreview(fileId);
    }

    const newOpportunity = {
      title,
      description,
      ...(imageUrl && { imageUrl, fileId }),
      createdBy: user.uid,
      createdAt: new Date(),
    };

    console.log(newOpportunity);

    try {
      await dbServices.createOpportunity(newOpportunity);
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error creating opportunity:", error);
    }
  };

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg, image/jpg, image/gif, image/webp";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) setImage(file);
    };
    input.click();
  };

  const onDelete = () => {
    setImage(null);
    setShowDelete(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-5 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-500/20 rounded-xl">
          <FaPlus className="text-green-400 text-lg" />
        </div>
        <h2 className="text-lg font-semibold text-gray-100">
          Post a New Opportunity
        </h2>
      </div>

      {/* Image Preview */}
      {image && (
        <div className="relative group rounded-xl overflow-hidden border-2 border-gray-700/50 hover:border-gray-600 transition-all">
          <img
            src={URL.createObjectURL(image)}
            alt="opportunity preview"
            className="w-full h-48 object-cover cursor-pointer"
          />
          <button
            className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-400 text-white rounded-full shadow-lg transition-all"
            onClick={onDelete}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Title */}
      <div className="space-y-3 mt-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400 ml-1">Title</label>
          <input
            type="text"
            className="w-full bg-gray-800/60 px-4 py-3 rounded-xl text-gray-200 placeholder-gray-500 
                      focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-gray-800/80 transition-all"
            placeholder="e.g., Internship at XYZ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400 ml-1">Description</label>
          <textarea
            className="w-full bg-gray-800/60 px-4 py-3 rounded-xl text-gray-200 placeholder-gray-500 resize-none 
                      focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-gray-800/80 transition-all
                      scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            placeholder="Describe the opportunity..."
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-6">
        {/* Add Image Button */}
        <button
          onClick={handleAddImage}
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-green-400 transition-colors"
        >
          <FaImage className="text-lg" />
          <span className="text-sm">
            {image ? "Change Image" : "Add Image"}
          </span>
        </button>

        {/* Post Button */}
        <button
          onClick={handleOpportunityPost}
          disabled={!title || !description}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
            ${
              title && description
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-lg"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
        >
          <FaPaperPlane className="text-lg" />
          <span>Post Opportunity</span>
        </button>
      </div>
    </div>
  );
}

export default NewOpportunity;
