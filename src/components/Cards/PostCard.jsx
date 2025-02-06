import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
  const { content, owner, createdAt, imageUrl } = post;
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  // Format createdAt to a readable format
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : "Unknown Date";

  const handleLike = () => {
    setLiked((prev) => !prev);
    if (!liked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked((prev) => !prev);
    if (!disliked) setLiked(false); // Remove like when disliking
  };

  return (
    <div className="w-full flex-1 bg-gray-800 p-4 rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl">
      <div className="bg-gray-900 p-4 rounded-lg shadow space-y-4 h-full">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between space-x-3 mb-3">
            <div className="flex items-center space-x-3 mb-3">
              <div
                className="h-12 w-12 rounded-full overflow-hidden bg-gray-600"
                onClick={() => navigate(`/profile/${post.createdBy?.id}`)}
              >
                <img
                  src={post.createdBy?.avatar || "avatar.png"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-gray-100 text-lg">
                  {owner || "Anonymous"}
                </div>
                <div className="text-sm text-gray-400">{formattedDate}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 w-[30%] justify-around">
              <div
                className="h-10 w-10 cursor-pointer p-2 hover:size-11 rounded-xl flex items-center justify-around gap-2 "
                onClick={handleLike}
              >
                <img src={liked ? "liked.svg" : "like.svg"} alt="" />
                <span className="text-gray-400">{post.likes || 0}</span>
              </div>
              <div
                className="h-10 w-10 cursor-pointer p-2 hover:size-11 rounded-xl flex items-center justify-around gap-2"
                onClick={handleDislike}
              >
                <img src={disliked ? "disliked.svg" : "dislike.svg"} alt="" />
                <span className="text-gray-400">{post.dislikes || 0}</span>
              </div>
              <div className="h-10 w-10 cursor-pointer p-2 hover:bg-gray-700 rounded-xl">
                <img src="share.svg" alt="" />
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src={imageUrl}
              alt="Post Image"
              className="rounded-lg object-cover w-full h-64 mb-4"
            />
          </div>
          <p className="text-gray-300 text-base">{content}</p>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
