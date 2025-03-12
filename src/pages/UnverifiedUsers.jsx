import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dbServices from "../firebase/firebaseDb";

function UnverifiedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { users, lastVisible } = await dbServices.getUnverifiedUsers();
        setUsers(users);
        setLastVisible(lastVisible);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleAccept = async (userId) => {
    try {
      await dbServices.acceptUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      alert("User accepted successfully");
    } catch (error) {
      alert("Failed to accept user");
    }
  };

  const handleRejectClick = (userId) => {
    setSelectedUserId(userId);
    setRejectReason("");
  };

  const handleReject = async () => {
    if (!selectedUserId || !rejectReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    try {
      await dbServices.deleteUserFromFirestore(selectedUserId);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUserId)
      );
      setSelectedUserId(null);
      setRejectReason("");
      alert("User rejected successfully");
    } catch (error) {
      alert("Failed to reject user");
    }
  };

  const handleLoadMore = async () => {
    if (!lastVisible) return;

    setLoadingMore(true);

    try {
      const { users: newUsers, lastVisible: newLastVisible } =
        await dbServices.getUnverifiedUsers(lastVisible);
      setUsers((prev) => [...prev, ...newUsers]);
      setLastVisible(newLastVisible);
    } catch (error) {
      alert("Failed to load more users");
    }

    setLoadingMore(false);
  };

  if (loading)
    return <div className="text-gray-400 text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Unverified Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-400">No unverified users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              {/* User Info */}
              <Link to={`/profile/${user.id}`} className="flex-1">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-400">{user.email}</p>
              </Link>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(user.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectClick(user.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md"
                >
                  Reject
                </button>
              </div>

              {/* Rejection Reason Form */}
              {selectedUserId === user.id && (
                <div className="mt-4 w-full">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection"
                    rows="2"
                    className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleReject}
                      className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-md"
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {lastVisible && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default UnverifiedUsers;
