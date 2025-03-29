import React, { useState, useEffect, useCallback } from "react";
import AchievementCard from "./AchievementCard";
import dbServices from "../../firebase/firebaseDb";
import NewAchievement from "./NewAchievement";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

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
    <div className="flex flex-col w-full gap-2 h-[90vh] bg-black backdrop-blur-sm shadow-inner overflow-auto">
      {/* New Achievement Form  */}
      <div>
        <NewAchievement
          onAdd={(newAchievement) =>
            setAchievements((prev) => [newAchievement, ...prev])
          }
        />
      </div>

      {achievements.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400/80">
          <p className="text-lg md:text-xl font-medium">
            No achievements to show
          </p>
        </div>
      ) : (
        // Responsive grid layout
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {achievements.map((achievement) => (
            <div className="break-inside-avoid" key={achievement.id}>
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onDelete={(deletedId) =>
                  setAchievements((prev) =>
                    prev.filter((a) => a.id !== deletedId)
                  )
                }
              />
            </div>
          ))}
        </div>
      )}

      {loading && <Loader className="mx-auto" />}

      {!hasMore && !loading && achievements.length > 0 && (
        <div className="p-4 text-center text-gray-400 text-sm md:text-base">
          No more achievements to load
        </div>
      )}
    </div>
  );
}

export default Achievements;
