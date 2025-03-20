import React, { useState, useEffect, useCallback } from "react";
import AchievementCard from "./AchievementCard";
import dbServices from "../../firebase/firebaseDb";
import NewAchievement from "./NewAchievement";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.userData);

  // Prevent duplicate fetching
  const isFetching = React.useRef(false);

  const fetchAchievements = useCallback(async () => {
    if (!user) navigate("/");
    if (!hasMore || loading || isFetching.current) return;

    isFetching.current = true; // Set flag to true to prevent double fetching
    setLoading(true);
    setError(null);

    try {
      const { achievements: newAchievements, lastVisible: newLastVisible } =
        await dbServices.getAllAchievements(lastVisible);

      setAchievements((prev) => [...prev, ...newAchievements]);
      setLastVisible(newLastVisible);
      setHasMore(!!newLastVisible);
    } catch (error) {
      setError(error.message || "Failed to load achievements");
    } finally {
      setLoading(false);
      isFetching.current = false; // Reset flag after completion
    }
  }, [hasMore, loading]);

  // Initial load
  useEffect(() => {
    fetchAchievements();
  }, []);

  // console.log(achievements);

  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="flex flex-col gap-4 p-2 w-full rounded-xl h-[90vh] bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm shadow-inner overflow-auto">
      <NewAchievement
        onAdd={(newAchievement) =>
          setAchievements((prev) => [newAchievement, ...prev])
        }
      />

      {achievements.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400/80">
          <p className="text-lg font-medium">No achievements to show</p>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap justify-between p-5">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onDelete={(deletedId) =>
                setAchievements((prev) =>
                  prev.filter((a) => a.id !== deletedId)
                )
              }
              className="hover:ring-1 hover:ring-gray-600/50 transition-all"
            />
          ))}
        </div>
      )}

      {loading && (
        <div className="p-4 text-center text-gray-400">
          Loading achievements...
        </div>
      )}

      {!hasMore && !loading && achievements.length > 0 && (
        <div className="p-4 text-center text-gray-400">
          No more achievements to load
        </div>
      )}
    </div>
  );
}

export default Achievements;
