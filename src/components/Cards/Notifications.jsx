import React, { useEffect, useState } from "react";
import dbServices from "../../firebase/firebaseDb";

function Notification({
  notification,
  userId,
  setNotifications,
  setNotificationCount,
}) {
  async function handleMarkAsRead(notificationId) {
    await dbServices.deleteNotification(notificationId, userId);
    setNotifications((prev) =>
      prev.filter((item) => item.id !== notificationId)
    );
    setNotificationCount((prev) => prev - 1);
  }

  async function deleteConnectionRequest(status, notificationId) {
    console.log(status, notificationId);
    await dbServices.handleConnectionRequest(
      status,
      notification.other,
      userId
    );
    // notifiactionId is other user's id
    await dbServices.deleteNotification(notificationId, userId);
    setNotifications((prev) =>
      prev.filter((item) => item.id !== notificationId)
    );
    setNotificationCount((prev) => prev - 1);
  }

  return (
    <div
      className={`flex items-start flex-col gap-3 p-4 bg-gray-900 hover:bg-gray-800 shadow-md rounded-lg w-full max-w-md`}
    >
      <div className="flex items-center gap-3 justify-between w-full">
        {notification.type === "connectionRequest" && (
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img
              src={notification.otherAvatar || "/avatar.png"}
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-sm font-semibold">{notification.otherName}</h3>
          <p className="text-sm text-gray-300">{notification.content}</p>
        </div>
        <div
          className={`text-sm bg-gray-700 rounded-md p-1 align-middle hover:bg-gray-600 cursor-pointer ${
            notification.type === "connectionRequest" ? "hidden" : ""
          }`}
          onClick={() => handleMarkAsRead(notification.id)}
        >
          <p>mark as read</p>
        </div>
      </div>
      {notification.type === "connectionRequest" && (
        <div className="flex items-center justify-evenly w-[60%]  rounded-md">
          <button
            className="bg-green-500 text-white px-2 py-1 rounded-md hover:scale-105 transition-all text-sm"
            onClick={() => deleteConnectionRequest("accepted", notification.id)}
          >
            Accept
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded-md hover:scale-105 transition-all text-sm"
            onClick={() => deleteConnectionRequest("rejected", notification.id)}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

function Notifications({ userId, setNotificationCount }) {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    getNotifications();
  }, []);

  async function getNotifications() {
    const notifications = await dbServices.getNotifications(userId);
    setNotifications((prev) => notifications);
  }

  return (
    <div className="notifications max-h-[40vh] overflow-scroll scrollbar-hide bg-gray-900 rounded-xl border p-2">
      <div className="font-bold text-sm text-white mb-4 px-4">
        Notifications
      </div>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            userId={userId}
            setNotifications={setNotifications}
            setNotificationCount={setNotificationCount}
          />
        ))
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-400 mb-2">No unread notifications.</p>
          <p className="text-sm text-gray-500">We'll let you know </p>
        </div>
      )}
    </div>
  );
}

export default Notifications;
