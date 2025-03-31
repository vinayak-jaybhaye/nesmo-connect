import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import appwriteStorage from "../../appwrite/appwriteStorage";
import dbServices from "../../firebase/firebaseDb";
import {
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  MoreVertical,
  ShareIcon,
  BookmarkCheck,
  Bookmark,
  Trash,
} from "lucide-react";

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
  const [showFullContent, setShowFullContent] = useState(false);
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
          <span className="font-thin text-white">{/* Like this post */}</span>
        </div>
      );

    return (
      <div
        className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
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
      <div className="absolute h-auto max-h-[70%] w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] z-10 bottom-20 flex flex-col right-0 gap-2 p-3 sm:p-4 overscroll-auto bg-gray-900/95 rounded-lg shadow-xl backdrop-blur-sm overflow-y-auto border border-gray-700">
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-700">
          <h3 className="text-white font-semibold">Liked by</h3>
          <button
            onClick={() => setShowAllLikes(false)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {likedBy.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-2 gap-3 bg-gray-800/90 rounded-lg shadow-md hover:bg-gray-700/90 transition-colors"
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
            <div className="text-gray-300/90 font-medium">{user.name}</div>
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
      className="w-full flex-1 bg-black shadow-lg shadow-black/40  transition-all transform hover:shadow-xl overflow-auto border-b border-white/40 py-1"
      onClick={() => (showMenu ? setShowMenu(false) : null)}
    >
      <div className="bg-black rounded-xl shadow-inner space-y-3 sm:space-y-4 h-full backdrop-blur-sm">
        {/* Header section with user info and actions */}
        <div className="border-b border-gray-700/50 bg-black/40 p-2 sm:p-3 rounded-md">
          <div className="flex flex-row justify-between items-center gap-2">
            {/* User info */}
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <div
                className="h-9 w-9 md:h-10 md:w-10 rounded-full overflow-hidden bg-gray-600/80 cursor-pointer ring-2 ring-gray-600 hover:ring-green-500 transition-all"
                onClick={() => {
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
                <div className="font-semibold text-gray-100 text-sm md:text-base hover:text-green-400 transition-colors cursor-pointer">
                  {createdBy.name || "Anonymous"}
                </div>
                <div className="text-xs md:text-sm text-gray-400/90">
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center lg:pr-12 space-x-1 sm:space-x-2 justify-end">
              {/* Like button */}
              <div
                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-all duration-200 group"
                onClick={handleLike}
              >
                <ThumbsUp
                  className={`text-blue-500 w-5 h-5 ${
                    likedStatus === "liked" ? "fill-blue-500" : ""
                  }`}
                />

                <span
                  className={`text-xs sm:text-sm ${
                    likedStatus === "liked" ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {likes || 0}
                </span>
              </div>

              {/* Dislike button */}
              <div
                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-all duration-200 group"
                onClick={handleDislike}
              >
                <ThumbsDown
                  className={`text-red-500 w-5 h-5 ${
                    likedStatus === "disliked" ? "fill-red-500" : ""
                  }`}
                />
                <span
                  className={`text-xs sm:text-sm ${
                    likedStatus === "disliked"
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {dislikes || 0}
                </span>
              </div>

              {/* Menu button */}
              <div className="relative">
                <div
                  className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
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
                  <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-gray-200" />
                </div>

                {/* Dropdown menu */}
                {showMenu && (
                  <div className="absolute top-10 right-0 z-20 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-1.5 space-y-1 backdrop-blur-sm">
                    {post.createdBy.id === userData?.uid && (
                      <div
                        className="cursor-pointer hover:bg-gray-700/50 rounded-lg p-2 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                        onClick={handleDeletePost}
                      >
                        <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Delete</span>
                      </div>
                    )}
                    <div
                      className="cursor-pointer hover:bg-gray-700/50 rounded-lg p-2 flex items-center gap-2 text-sm text-gray-300 hover:text-gray-100 transition-colors"
                      onClick={handleSharePost}
                    >
                      <ShareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Share</span>
                    </div>
                    <div
                      className="cursor-pointer hover:bg-gray-700/50 rounded-lg p-2 flex items-center gap-2 text-sm text-gray-300 hover:text-gray-100 transition-colors"
                      onClick={handleSavePost}
                    >
                      {isPostSaved ? (
                        <BookmarkCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                      ) : (
                        <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                      )}
                      <span>{isPostSaved ? "Saved" : "Save"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Post content */}
          <div
            className="relative group mt-3 pl-8 md:pl-12 lg:px-16"
            onClick={() => setShowAllLikes(false)}
          >
            {showAllLikes && renderLikedByList()}

            {/* Post image */}
            {imageUrl && (
              <div className="rounded-xl overflow-hidden ring-1 mb-3 ring-gray-700 transition-all hover:ring-gray-600">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Post Image"
                  className="rounded-lg object-cover w-full h-48 sm:h-56 md:h-64 transform transition-all hover:scale-[1.02] duration-500"
                  loading="lazy"
                />
              </div>
            )}

            {/* Post text */}
            <pre
              className={`text-gray-300/85 ${
                showFullContent ? "" : "max-h-96"
              } bg-black/60 leading-relaxed text-sm sm:text-base md:text-lg border-l-4 border-green-500/30 pl-3 sm:pl-4 py-2 ml-0 sm:ml-2 italic font-light whitespace-pre-wrap overflow-auto rounded-r-md`}
              onClick={() => setShowFullContent((prev) => !prev)}
            >
              {content}
            </pre>
          </div>
        </div>

        {/* Likes section */}
        <div className="text-gray-400 text-xs sm:text-sm rounded-lg transition-colors hover:text-gray-300 p-1">
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
