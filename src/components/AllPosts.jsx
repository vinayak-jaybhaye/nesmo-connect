import React, { useState, useEffect } from "react";
import PostCard from "./Cards/PostCard";
import dbServices from "../firebase/firebaseDb";
import { useSelector } from "react-redux";

function AllPosts({ userId }) {
  const [allPosts, setAllPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [lastVisible, setLastVisible] = useState({
    allPosts: null,
    myPosts: null,
    savedPosts: null,
  });

  const selectPost =
    useSelector((state) => state.vars.selectPost) || "allPosts";

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        if (selectPost === "allPosts" && allPosts.length === 0) {
          const result = await dbServices.getRandomPosts();
          setAllPosts(result);
        } else if (selectPost === "myPosts" && myPosts.length === 0) {
          const { posts, lastVisible: newLastVisible } =
            await dbServices.getMyPosts(userId, lastVisible.myPosts);
          setMyPosts(posts);
          setLastVisible((prev) => ({ ...prev, myPosts: newLastVisible }));
        } else if (selectPost === "savedPosts" && savedPosts.length === 0) {
          const { posts, lastVisible: newLastVisible } =
            await dbServices.getSavedPosts(userId, lastVisible.savedPosts);
          setSavedPosts(posts);
          setLastVisible((prev) => ({ ...prev, savedPosts: newLastVisible }));
        }
      } catch (error) {
        setError(error.message || "Something went wrong.");
      }
      setLoading(false);
    };

    fetchPosts();
  }, [selectPost, userId]); // Fetch only when needed

  // Select correct posts list based on `selectPost`
  const posts =
    selectPost === "allPosts"
      ? allPosts
      : selectPost === "myPosts"
      ? myPosts
      : savedPosts;

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="flex flex-col max-h-[100vh] overflow-scroll scrollbar-hide gap-4 p-2 bg-gray-800/80 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-inner">
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400/80">
          <p className="text-lg font-medium">No posts to show</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            className="hover:ring-1 hover:ring-gray-600/50 transition-all"
          />
        ))
      )}
    </div>
  );
}

export default AllPosts;
