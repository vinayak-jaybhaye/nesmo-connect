import React, { useEffect, useState } from "react";
import appwriteStorage from "../../appwrite/appwriteStorage";
import dbServices from "../../firebase/firebaseDb";
import { Image, SendHorizonal, DeleteIcon, Trash } from "lucide-react";

function NewPost({ user, setPosts }) {
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
    };

    const response = await dbServices.createPost(newPost, user.uid);
    newPost.id = response.id;
    newPost.createdAt = response.createdAt;
    newPost.createdBy = { ...user, id: user.uid };
    setPosts((prev) => [newPost, ...prev]);
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
    <div className="bg-blackbg-gray-800/80 p-4 w-full rounded-t-xl shadow-xl border-b backdrop-blur-sm">
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
      <div className="bg-gray-900/50 flex flex-col gap-2 mt-4 rounded-xl">
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
                className="absolute top-3 right-3 p-2 text-white rounded-full shadow-lg transition-all"
                onClick={onDelete}
              >
                <img src="/delete.svg" className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <textarea
          className="bg-gray-800/60 p-3 rounded-xl w-full  text-gray-200 placeholder-gray-500 resize-none scrollbar-hide 
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

      <div className="flex justify-between items-center mt-3  p-1 rounded-xl">
        <div className="flex gap-2">
          <button
            className="flex gap-2 p-1 rounded-xl transition-all group"
            onClick={handleAddImage}
          >
            <Image className="w-5 h-5 text-gray-200 group-hover:text-gray-100" />
            <span className="text-gray-200 group-hover:text-gray-100 text-sm font-semibold">
              Add Image
            </span>
          </button>
        </div>

        <button
          className={`flex gap-2 p-2 rounded-md transition-all ${
            content
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-600/50 cursor-not-allowed"
          }`}
          onClick={handlePost}
          disabled={!content}
        >
          <span className="text-gray-200 text-sm font-semibold">Post</span>
          {/* <SendHorizonal className="w-5 h-5 text-gray-200" /> */}
        </button>
      </div>
    </div>
  );
}

export default NewPost;
