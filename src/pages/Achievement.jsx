import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dbServices from "../firebase/firebaseDb";
import { AchievementCard } from "../components";

function Achievement() {
  const { achievementId } = useParams();
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    if (!achievementId) return;

    const controller = new AbortController();
    const fetchAchievement = async () => {
      try {
        const response = await dbServices.getAchievementById(achievementId);
        setAchievement(response);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching achievement:", error);
        }
      }
    };

    fetchAchievement();

    return () => controller.abort(); // Cleanup to prevent memory leaks
  }, [achievementId]);

  if (!achievement) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <AchievementCard achievement={achievement} />
    </div>
  );
}

export default Achievement;
