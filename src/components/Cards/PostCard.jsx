import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import appwriteStorage from "../../appwrite/appwriteStorage";
import dbServices from "../../firebase/firebaseDb";

import { toast } from "react-toastify";

function PostCard({ post, setPosts }) {
  const { content, createdAt, imageUrl } = post;
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const selectPost =
    useSelector((state) => state.vars.selectPost) || "allPosts";

  const [likedStatus, setLikedStatus] = useState(null);
  const [showAllLikes, setShowAllLikes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [lastVisible, setLastVisible] = useState({ likedUsers: null });
  const [{ likes, dislikes }, setLikesAndDislikes] = useState({
    likes: 0,
    dislikes: 0,
  });
  const [isPostSaved, setIsPostSaved] = useState(-1);
  const [likedBy, setLikedBy] = useState([]);

  // Format createdAt to a readable format
  const formattedDate = dbServices.formatFirebaseTimestamp(createdAt);
  let createdBy = post.createdBy || { name: "Anonymous" };
  if (selectPost === "myPosts") {
    createdBy = userData;
  }

  // Fetch post status for the current user
  useEffect(() => {
    const fetchLikedStatus = async () => {
      if (userData.uid) {
        const status = await dbServices.getLikedStatus(post.id, userData.uid);
        const { likedUsers, lastVisible: newLastVisible } =
          await dbServices.getLikedUsers(post.id);
        const { likes, dislikes } = await dbServices.getLikesAndDislikes(
          post.id
        );
        setLastVisible((prev) => ({
          ...prev,
          likedUsers: newLastVisible,
        }));
        setLikesAndDislikes({ likes, dislikes });
        setLikedStatus(status);
        setLikedBy((prev) => likedUsers);
      }
    };

    fetchLikedStatus();
  }, [userData]);

  useEffect(() => {
    async function fetchLikesAndDislikes() {
      const { likes, dislikes } = await dbServices.getLikesAndDislikes(post.id);
      const { likedUsers, lastVisible: newLastVisible } =
        await dbServices.getLikedUsers(post.id);
      setLikesAndDislikes({ likes, dislikes });
      setLastVisible((prev) => ({
        ...prev,
        likedUsers: newLastVisible,
      }));
      setLikedBy((prev) => likedUsers);
    }
    fetchLikesAndDislikes();
  }, [likedStatus]);

  const handleLike = async () => {
    // Compute new likedStatus before setting state
    const newStatus =
      likedStatus === null || likedStatus === "disliked" ? "liked" : null;

    // Update Firestore first
    if (userData.uid)
      await dbServices.updateLikes(post.id, userData.uid, newStatus);

    // Update React state
    setLikedStatus(newStatus);
  };

  const handleDislike = async () => {
    // Compute new status BEFORE updating state
    const newStatus =
      likedStatus === null || likedStatus === "liked" ? "disliked" : null;

    // Update Firestore first to avoid race conditions
    if (userData.uid)
      await dbServices.updateLikes(post.id, userData.uid, newStatus);

    // Then update React state
    setLikedStatus(newStatus);
  };

  const handleDeletePost = async () => {
    if (imageUrl) {
      try {
        await appwriteStorage.deleteFile(post.fileId);
        console.log("Image deleted successfully!");
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
    await dbServices.deletePost(post.id, userData.uid);

    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    toast.success("Post Deleted Successfully!");
  };

  const renderLikedBy = () => {
    if (likedBy.length === 0)
      return (
        <div className="text-sm text-gray-400">
          <span className="font-thin text-white">
            Be first to like this post
          </span>
        </div>
      );

    return (
      <div
        className="text-sm text-gray-400 cursor-pointer"
        onClick={() => setShowAllLikes((prev) => !prev)}
      >
        <span className="font-thin text-white">{likedBy[0].name}</span>
        {likedBy.length > 1 && (
          <>
            {likedBy.length === 2 ? " and " : ", "}
            <span className="font-thin text-white">{likedBy[1].name}</span>
          </>
        )}
        {likedBy.length > 2 && (
          <>
            {" and "}
            <span className="font-thin text-white">
              {likedBy.length - 2} others
            </span>
          </>
        )}{" "}
        liked this post
      </div>
    );
  };

  const renderLikedByList = () => {
    return (
      <div className="absolute h-[70%] w-[50%] z-10 top-5 flex flex-col right-0 gap-2 p-4 overscroll-auto bg-transparent rounded-lg shadow-xl backdrop-blur-sm overflow-y-auto">
        {likedBy.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-2 gap-3 bg-gray-800/90 rounded-lg shadow-xl backdrop-blur-sm"
          >
            <div
              className="h-8 w-8 rounded-full overflow-hidden bg-gray-600/80 cursor-pointer ring-2 ring-gray-600 hover:ring-green-500 transition-all"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <img
                src={user.avatarUrl || "avatar.png"}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-gray-300/90">{user.name}</div>
          </div>
        ))}
      </div>
    );
  };

  const handleSavePost = async () => {
    try {
      const result = await dbServices.toggleSavePost(userData.uid, post.id);

      if (result.saved) {
        toast.success("Post Saved Successfully!");
        setIsPostSaved(true);
      } else {
        toast.success("Post removed from saved posts!");
        setIsPostSaved(false);
      }
    } catch (error) {
      console.error("Error saving/removing post:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSharePost = () => {
    navigator.clipboard.writeText(window.location.origin + "/post/" + post.id);
    toast.success("Post link copied to clipboard!");
  };

  return (
    <div
      className={`w-full flex-1 bg-gray-800 p-4 rounded-xl shadow-lg shadow-black/40 border border-gray-700 transition-all transform hover:scale-[1.01] hover:shadow-xl hover:border-gray-600`}
      onClick={() => (showMenu ? setShowMenu(false) : null)}
    >
      <div
        className="bg-gray-900/80 p-4 rounded-xl shadow-inner space-y-4 h-full backdrop-blur-sm"
        // onDoubleClick={() => setShowAllLikes((prev) => false)}
      >
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex justify-between space-x-3 mb-3">
            <div className="flex items-center space-x-3 mb-3">
              <div
                className="h-12 w-12 rounded-full overflow-hidden bg-gray-600/80 cursor-pointer ring-2 ring-gray-600 hover:ring-green-500 transition-all"
                onClick={() => {
                  console.log(post.createdBy);
                  navigate(`/profile/${createdBy?.id}`);
                }}
              >
                <img
                  src={createdBy.avatarUrl || "avatar.png"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-gray-100 text-lg hover:text-green-400 transition-colors cursor-pointer">
                  {createdBy.name || "Anonymous"}
                </div>
                <div className="text-sm text-gray-400/90">{formattedDate}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 w-[30%] justify-around">
              <div
                className="h-10 w-10 cursor-pointer p-2 hover:bg-gray-700/50 rounded-xl flex items-center justify-around gap-2 transition-all duration-200 group"
                onClick={handleLike}
              >
                <img
                  src={likedStatus === "liked" ? "liked.svg" : "like.svg"}
                  className={`w-6 h-6 transition-all ${
                    likedStatus === "liked"
                      ? "text-green-500"
                      : "text-gray-400 group-hover:text-green-400"
                  }`}
                  alt="Like"
                />
                <span
                  className={`text-sm ${
                    likedStatus === "liked" ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {likes || 0}
                </span>
              </div>

              <div
                className="h-10 w-10 cursor-pointer p-2 hover:bg-gray-700/50 rounded-xl flex items-center justify-around gap-2 transition-all duration-200 group"
                onClick={handleDislike}
              >
                <img
                  src={
                    likedStatus === "disliked" ? "disliked.svg" : "dislike.svg"
                  }
                  className={`w-6 h-6 transition-all ${
                    likedStatus === "disliked"
                      ? "text-red-500"
                      : "text-gray-400 group-hover:text-red-400"
                  }`}
                  alt="Dislike"
                />
                <span
                  className={`text-sm ${
                    likedStatus === "disliked"
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {dislikes || 0}
                </span>
              </div>

              <div className="relative">
                <div
                  className="h-10 w-10 cursor-pointer p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-200 flex items-center justify-center"
                  onClick={() =>
                    setShowMenu(async (prev) => {
                      if (!prev && isPostSaved === -1) {
                        const saved = await dbServices.isPostSaved(
                          userData.uid,
                          post.id
                        );
                        setIsPostSaved(saved);
                      }
                      return !prev;
                    })
                  }
                >
                  <img
                    src="menu.svg"
                    className="w-6 h-6 text-gray-400 hover:text-gray-200"
                    alt="Menu"
                  />
                </div>

                {showMenu && (
                  <div className="absolute top-12 right-0 z-20 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-2 space-y-2 backdrop-blur-sm">
                    {post.createdBy.id === userData?.uid && (
                      <div
                        className="cursor-pointer hover:bg-gray-700/50 rounded-lg p-2 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                        onClick={handleDeletePost}
                      >
                        <img src="delete.svg" className="h-5 w-5" />
                        <span>Delete</span>
                      </div>
                    )}
                    <div
                      className="cursor-pointer hover:bg-gray-700/50 rounded-lg p-2 flex items-center gap-2 text-sm text-gray-300 hover:text-gray-100 transition-colors"
                      onClick={handleSharePost}
                    >
                      <img src="share.svg" className="h-5 w-5" />
                      <span>Share</span>
                    </div>
                    <div
                      className="cursor-pointer hover:bg-gray-700/50 rounded-lg p-2 flex items-center gap-2 text-sm text-gray-300 hover:text-gray-100 transition-colors"
                      onClick={handleSavePost}
                    >
                      <img
                        src={isPostSaved ? "bookmarked.svg" : "bookmark.svg"}
                        className="h-5 w-5"
                      />
                      <span>{isPostSaved ? "Saved" : "Save"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="relative group"
            onClick={() => setShowAllLikes(false)}
          >
            {showAllLikes && (renderLikedByList() || null)}
            {imageUrl && (
              <div className="rounded-xl overflow-hidden ring-1 mb-2 ring-gray-700 transition-all hover:ring-gray-600">
                <img
                  src={imageUrl}
                  alt="Post Image"
                  className="rounded-lg object-fit w-full h-64  transform transition-all hover:scale-105 duration-700"
                />
              </div>
            )}
          </div>

          <pre className="text-gray-300/85 leading-relaxed text-lg border-l-4 border-green-500/30 pl-4 ml-2 italic font-light whitespace-pre-wrap overflow-x-auto">
            {content}
          </pre>
        </div>

        <div className="text-gray-400 text-sm rounded-lg transition-colors hover:text-gray-300">
          {likedBy && (
            <div className="flex items-center gap-2 flex-wrap">
              {renderLikedBy()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
