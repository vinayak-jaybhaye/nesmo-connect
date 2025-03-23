import React, { useState, useEffect, useCallback, useRef } from "react";
import OpportunityCard from "./OpportunityCard";
import dbServices from "../../firebase/firebaseDb";
import NewOpportunity from "./NewOpportunity";
import Loader from "../Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  // Prevent duplicate fetching
  const isFetching = useRef(false);

  const fetchOpportunities = useCallback(async () => {
    if (!user) navigate("/");
    if (!hasMore || loading || isFetching.current) return;

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const { opportunities: newOpportunities, lastVisible: newLastVisible } =
        await dbServices.getAllOpportunities(lastVisible);

      setOpportunities((prev) => [...prev, ...newOpportunities]);
      setLastVisible(newLastVisible);
      setHasMore(!!newLastVisible);
    } catch (error) {
      setError(error.message || "Failed to load opportunities");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [hasMore, loading, lastVisible, user]);

  // Initial load
  useEffect(() => {
    fetchOpportunities();
  }, []); // ✅ Only called on mount

  // console.log(opportunities);

  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="flex flex-col gap-4 p-2 w-full rounded-xl h-[90vh] bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm shadow-inner overflow-auto">
      {/* New Opportunity Form */}
      <NewOpportunity
        onNewOpportunity={(newOpportunity) =>
          setOpportunities((prev) => [newOpportunity, ...prev])
        }
      />

      {/* Display Opportunities */}
      {opportunities.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400/80">
          <p className="text-lg font-medium">No opportunities to show</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 p-2 space-y-4">
          {opportunities.map((opportunity) => (
            <div className="break-inside-avoid" key={opportunity.id}>
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onDelete={(deletedId) =>
                  setOpportunities((prev) =>
                    prev.filter((o) => o.id !== deletedId)
                  )
                }
                className="hover:ring-1 hover:ring-gray-600/50 transition-all mb-4"
              />
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && <Loader />}

      {/* No More Opportunities */}
      {!hasMore && !loading && opportunities.length > 0 && (
        <div className="p-4 text-center text-gray-400">
          No more opportunities to load
        </div>
      )}
    </div>
  );
}

export default Opportunities;
