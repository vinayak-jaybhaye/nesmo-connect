import React, { useState, useEffect, useId } from "react";
import PostCard from "./Cards/PostCard";
import dbServices from "../firebase/firebaseDb";
import { useSelector } from "react-redux";

function AllPosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectPost = useSelector((state) => state.vars.selectPost || "myPosts");
  // console.log(selectPost)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        if (selectPost === "myPosts") {
          // const posts = await dbServices.getAllPosts(userId);
          const posts = await dbServices.getMyPosts(userId);
          setPosts(posts);
        } else {  
          const posts = await dbServices.getAllPosts();
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
    <div className="flex flex-col max-h-[80vh] overflow-scroll scrollbar-hide gap-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default AllPosts;
