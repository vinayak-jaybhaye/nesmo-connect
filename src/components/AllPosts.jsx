import React, { useState, useEffect, useId } from "react";
import PostCard from "./Cards/PostCard";
import dbServices from "../firebase/firebaseDb";
import { useSelector } from "react-redux";

function AllPosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectPost =
    useSelector((state) => state.vars.selectPost) || "allPosts";
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        if (selectPost === "allPosts") {
          // const posts = await dbServices.getAllPosts(userId);
          const posts = await dbServices.getAllPosts();
          setPosts(posts);
        } else if (selectPost === "myPosts") {
          const posts = await dbServices.getMyPosts(userId);
          setPosts(posts);
        }else if(selectPost === "savedPosts"){
          console.log("savedPosts");
          const posts = await dbServices.getSavedPosts(userId);
          setPosts(posts);
        }
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [selectPost]);

  if (posts.length === 0) {
    return <div>No posts found</div>;
  }
  return (
    <div className="flex flex-col max-h-[100vh] overflow-scroll scrollbar-hide gap-4 p-2 bg-gray-800/80 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-inner">
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400/80 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 mb-4 text-gray-500"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium">No posts to show</p>
          <p className="text-sm mt-1 text-gray-500">
            Be the first to share something!
          </p>
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
