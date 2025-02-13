import React, { useEffect, useState } from "react";
import appwriteStorage from "../../appwrite/appwriteStorage";
import dbServices from "../../firebase/firebaseDb";

function NewPost({ user }) {
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const handlePost = async () => {
    if (content.trim() === "") {
      return;
    }
  
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
  
    const newPost = {
      content,
      ...(imageUrl && { imageUrl, fileId }),
      createdBy: user.uid,
      owner: user.name,
      ownerAvatarUrl: user?.avatarUrl || "",
    };
  
      await dbServices.createPost(newPost, user.uid);
      setContent("");
      setImage(null);
  
  };
  
  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg, image/jpg, image/gif, image/webp";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
      }
    };
    input.click();
  };

  const onDelete = () => {
    setImage(null);
    setShowDelete(false);
  };

  return (
    <div className="bg-gray-800/80 p-4 rounded-xl shadow-xl border border-gray-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-gray-100 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-blue-500"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"
          />
          <path strokeLinecap="round" d="M12 8v4m0 0v4m0-4H8m4 0h4" />
        </svg>
        <span className="font-bold text-gray-300 text-sm">
          Create a new post
        </span>
      </div>
      <div className="bg-gray-900/50 p-3 rounded-xl">
        {image && (
          <div className="relative group">
            <img
              src={URL.createObjectURL(image)}
              alt="post preview"
              className="w-full h-52 object-cover rounded-xl cursor-pointer ring-1 ring-gray-700/50 hover:ring-gray-600 transition-all"
              onClick={() => setShowDelete(!showDelete)}
            />

            {showDelete && (
              <button
                className="absolute top-3 right-3 p-2 bg-red-600/90 hover:bg-red-700 text-white rounded-full shadow-lg transition-all"
                onClick={onDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <textarea
          className="w-full bg-gray-800/60 p-3 rounded-xl  text-gray-200 placeholder-gray-500 resize-none scrollbar-hide 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-gray-800/80 transition-all"
          placeholder="Share your thoughts..."
          onChange={(e) => {
            setContent(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
            e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
          }}
          value={content}
        />
      </div>

      <div className="flex justify-between items-center mt-3 bg-gray-700/40 p-1 rounded-xl">
        <div className="flex gap-2">
          <button
            className="p-2 hover:bg-gray-600/50 rounded-xl transition-all group"
            onClick={handleAddImage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-400 group-hover:text-blue-400"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        <button
          className={`p-2 rounded-xl transition-all ${
            content
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-600/50 cursor-not-allowed"
          }`}
          onClick={handlePost}
          disabled={!content}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-100"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NewPost;
