import React, { useEffect, useState } from "react";
import dbServices from "../../firebase/firebaseDb";
import { useSelector, useDispatch } from "react-redux";
import { generateChatId } from "../../utils/helper";
import { setVars } from "../../store/varSlice";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "../chats/helperComponents";

function ProfileConnections({ profileData, profileId }) {
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [showConnections, setShowConnections] = useState(true);
  const [lastVisible, setLastVisible] = useState({
    connections: null,
    connectionRequests: null,
  });

  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isProfileOwner = profileId === userData.uid;

  useEffect(() => {
    getConnections();
    if (profileId == userData.uid) getConnectionRequests();
  }, []);

  const getConnections = async () => {
    const { connections, lastVisible: newLastVisible } =
      await dbServices.getConnections(profileId);
    setLastVisible((prev) => ({ ...prev, connections: newLastVisible }));
    setConnections(connections);
  };

  const getConnectionRequests = async () => {
    const { connectionRequests, lastVisible: newLastVisible } =
      await dbServices.getConnectionRequests(profileId);
    setLastVisible((prev) => ({ ...prev, connectionRequests: newLastVisible }));
    setConnectionRequests(connectionRequests);
  };

  const handleMessage = async (connection) => {
    const chatId = generateChatId(userData.uid, connection.id);
    const isChatExist = await dbServices.checkChatExists(chatId, userData.uid);
    if (isChatExist) {
      dispatch(setVars({ selectChat: chatId }));
      navigate("/chats/" + chatId);
    } else {
      await dbServices.createGroupChat(
        chatId,
        [userData.uid, connection.id],
        "private",
        [userData.name, connection.name]
      );
    }
    dispatch(setVars({ selectChat: chatId }));
    navigate("/chats/" + chatId);
  };

  const handleDeleteConnection = async (connectionId) => {
    await dbServices.deleteConnection(userData.uid, connectionId);
    getConnections();
  };

  const resolveConnectionRequest = async (status, senderId, receiverId) => {
    await dbServices.handleConnectionRequest(status, senderId, receiverId);
    await dbServices.deleteNotification(senderId, receiverId);
  };

  return (
    <div
      className="absolute z-10 md:left-40 bg-gray-100 p-4 rounded-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Tabs for switching between Connections and Requests */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md font-medium transition ${
            showConnections
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setShowConnections(true)}
        >
          Connections
        </button>
        {userData.uid === profileId && (
          <button
            className={`px-4 py-2 rounded-md font-medium transition ${
              !showConnections
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setShowConnections(false)}
          >
            Requests
          </button>
        )}
      </div>

      {/* Content for Connections */}
      {showConnections ? (
        <div className="bg-white p-4 rounded-md shadow-md">
          {connections?.length > 0 ? (
            connections.map((connection, index) => (
              <div
                className="flex items-center gap-4 justify-between p-2 border-b border-gray-300"
                key={connection.id || index} // Ensure a unique key
              >
                <h1
                  className="text-lg font-bold text-gray-800 cursor-pointer"
                  onClick={() => {
                    navigate(`/profile/${connection.id}`);
                  }}
                >
                  {connection.name}
                </h1>
                {isProfileOwner && (
                  <div className="flex items-center gap-4">
                    <button
                      className="rounded-md bg-violet-500 p-1 h-8 w-8 cursor-pointer shadow-sm transition duration-300 hover:shadow-lg hover:scale-110"
                      onClick={() => handleMessage(connection)}
                      aria-label={`Message ${connection.name}`}
                    >
                      <img src="/chat.svg" alt="Chat icon" />
                    </button>
                    {userData.uid === profileId && (
                      <button
                        className="rounded-md bg-red-500 p-1 h-8 w-8 cursor-pointer shadow-sm transition duration-300 hover:shadow-lg hover:scale-110"
                        onClick={() =>
                          handleDeleteConnection(
                            connection.id || connection.other
                          )
                        }
                        aria-label={`Message ${connection.name}`}
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No connections found.</p>
          )}
        </div>
      ) : (
        // Content for Connection Requests
        <div className="bg-white p-4 rounded-md shadow-md">
          {connectionRequests?.length > 0 ? (
            connectionRequests.map((request) => (
              <div
                className="flex items-center gap-4 justify-between p-2 border-b border-gray-300"
                key={request.other} // Assuming `other` is a unique identifier
              >
                <h1
                  className="text-lg font-bold text-gray-800 cursor-pointer"
                  onClick={() => {
                    navigate(`/profile/${request.other}`);
                  }}
                >
                  {request.senderData.name}
                </h1>
                <span
                  className={`px-2 py-1 text-sm rounded-md ${
                    request.type === "sent"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {request.type === "sent" ? (
                    "Sent"
                  ) : (
                    <div className="flex items-center justify-evenly w-[60%]  rounded-md">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded-md hover:scale-105 transition-all text-sm"
                        onClick={() =>
                          resolveConnectionRequest(
                            "accepted",
                            request.other,
                            userData.uid
                          )
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:scale-105 transition-all text-sm"
                        onClick={() =>
                          resolveConnectionRequest(
                            "rejected",
                            request.other,
                            userData.uid
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No connection requests.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileConnections;
