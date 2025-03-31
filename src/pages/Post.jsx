import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { PostCard } from "../components";
import dbServices from "../firebase/firebaseDb";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!postId) return;

    const controller = new AbortController();

    const fetchPost = async () => {
      try {
        const response = await dbServices.getPostById(postId);
        setPost(response);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching post:", error);
        }
      }
    };

    if (user) fetchPost();

    return () => controller.abort();
  }, [postId, user]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PostCard post={post} />
    </div>
  );
}

export default Post;
