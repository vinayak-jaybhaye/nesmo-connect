import React, { useState, useEffect } from "react";
import PostCard from "./Cards/PostCard";
import dbServices from "../firebase/firebaseDb";
import { useSelector } from "react-redux";
import NewPost from "./Cards/NewPost";
import Loader from "../components/Loader";

function AllPosts({ user }) {
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
            await dbServices.getMyPosts(user.uid, lastVisible.myPosts);
          setMyPosts(posts);
          setLastVisible((prev) => ({ ...prev, myPosts: newLastVisible }));
        } else if (selectPost === "savedPosts" && savedPosts.length === 0) {
          const { posts, lastVisible: newLastVisible } =
            await dbServices.getSavedPosts(user.uid, lastVisible.savedPosts);
          setSavedPosts(posts);
          setLastVisible((prev) => ({ ...prev, savedPosts: newLastVisible }));
        }
      } catch (error) {
        setError(error.message || "Something went wrong.");
      }
      setLoading(false);
    };

    fetchPosts();
  }, [selectPost, user.uid]); // Fetch only when needed

  // Select correct posts list based on `selectPost`
  const posts =
    selectPost === "allPosts"
      ? allPosts
      : selectPost === "myPosts"
      ? myPosts
      : savedPosts;

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="text-red-400 text-center">
        ⚠️ Error: {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div className="flex flex-col max-h-[100vh] w-full overflow-scroll scrollbar-hide gap-4 p-2 bg-gray-800/80 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-inner">
      <NewPost
        setPosts={
          selectPost === "allPosts"
            ? setAllPosts
            : selectPost === "myPosts"
            ? setMyPosts
            : setSavedPosts
        }
        user={user}
      />

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400/80">
          <p className="text-lg font-medium">No posts to show</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1 h-[100vh] relative overflow-auto">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              setPosts={
                selectPost === "allPosts"
                  ? setAllPosts
                  : selectPost === "myPosts"
                  ? setMyPosts
                  : setSavedPosts
              }
              className="hover:ring-1 hover:ring-gray-600/50 transition-all"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllPosts;
