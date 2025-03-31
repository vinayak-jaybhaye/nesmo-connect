import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dbServices from "../firebase/firebaseDb";
import { OpportunityCard } from "../components";

function Opportunity() {
  const { opportunityId } = useParams();
  const [opportunity, setOpportunity] = useState(null);

  useEffect(() => {
    if (!opportunityId) return; // Prevent unnecessary fetch

    const controller = new AbortController();
    const fetchOpportunity = async () => {
      try {
        const response = await dbServices.getOpportunityById(opportunityId);
        setOpportunity(response); // No need for `response.json()`
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching opportunity:", error);
        }
      }
    };

    fetchOpportunity();

    return () => controller.abort(); // Cleanup to prevent memory leaks
  }, [opportunityId]);

  if (!opportunity) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <OpportunityCard opportunity={opportunity} />
    </div>
  );
}

export default Opportunity;
