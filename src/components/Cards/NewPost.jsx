import React, { useEffect, useState } from "react";
import appwriteStorage from "../../appwrite/appwriteStorage";
import dbServices from "../../firebase/firebaseDb";
import { arrayUnion } from "firebase/firestore";

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
      imageUrl = await appwriteStorage.getFilePreview(fileId);
    }

    const newPost = {
      content,
      ...(imageUrl && { imageUrl, fileId }),
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      owner: user.name,
      ownerAvatarUrl: user.avatarUrl,
    };

    try {
      const postRef = await dbServices.addWithAutoId("posts", newPost);
      setContent("");
      setImage(null);

      await dbServices.updateDocument("users", user.uid, {
        posts: arrayUnion(postRef),
      });

      console.log("Post added successfully!");
    } catch (error) {
      console.error("Error adding post:", error);
    }
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
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <div className="font-semibold mb-2">Add Post</div>
      <div className="bg-gray-900 p-2 rounded-lg">
        {image && (
          <div className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt="post img"
              className="w-full h-52 object-cover rounded-lg cursor-pointer"
              onClick={() => setShowDelete(!showDelete)} // Toggle button on click
            />

            {/* Delete Button */}
            {showDelete && (
              <button
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded shadow-md hover:bg-red-700 transition"
                onClick={onDelete} // Call the delete function
              >
                Delete
              </button>
            )}
          </div>
        )}

        <textarea
          className="w-full bg-gray-800 p-3 rounded-2xl mt-2 text-gray-200 resize-none scrollbar-hide "
          placeholder="What's on your mind?"
          onChange={(e) => {
            setContent(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
            e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
          }}
          value={content}
        />
      </div>
      <div className="flex justify-between items-center mt-2 bg-gray-700 p-1 rounded-lg">
        <div className="flex space-x-2">
          <div
            className="h-10 w-10 cursor-pointer hover:bg-gray-500 rounded-xl"
            onClick={handleAddImage}
          >
            <img src="addImg.svg" alt="add img" />
          </div>
          <div
            className="h-10 w-10 cursor-pointer p-1 hover:bg-gray-500 rounded-xl"
            onClick={handleAddImage}
          >
            <img src="attachments.svg" alt="" />
          </div>
        </div>

        <div
          className={`h-10 w-10 cursor-pointer  ${
            content != ""
              ? "bg-blue-600 hover:bg-blue-600"
              : "hover:bg-gray-500"
          } rounded-lg  rouded-xl`}
          onClick={handlePost}
        >
          <img src="post.svg" alt="post" />
        </div>
      </div>
    </div>
  );
}

export default NewPost;
