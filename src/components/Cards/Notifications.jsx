import React from "react";
import dbServices from "../../firebase/firebaseDb";

async function handleMarkAsRead(notification, userId) {
  await dbServices.deleteNotification(notification, userId);
//   console.log("Marked as read");
}
async function deleteConnectionRequest(notification, userId, status) {
  await dbServices.handleConnectionRequest(status, notification.other, userId);
  await dbServices.deleteNotification(notification, userId);
//   console.log(status);
}

function Notification({ notification, userId }) {
  return (
    <div className="flex items-start flex-col gap-3 p-4 bg-white shadow-md rounded-lg border border-gray-200 w-full max-w-md">
      {/* Icon */}
      <div className="flex items-center gap-3 justify-between w-full">
        <div className="flex-shrink-0 bg-blue-500 text-white p-2 rounded-full">
          <i className="fas fa-bell text-lg"></i>
        </div>

        {/* Notification Content */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800">
            {notification.type}
          </h3>
          <p className="text-xs text-gray-600">{notification.content}</p>
        </div>
        <div
          className={`text-sm text-gray-600 bg-gray-400 rounded-md px-1 align-middle hover:bg-gray-300 cursor-pointer ${
            notification.type === "connectionRequest" ? "hidden" : ""
          } `}
          onClick={() => handleMarkAsRead(notification, userId)}
        >
          <p>mark as read</p>
        </div>
      </div>
      {notification.type === "connectionRequest" && (
        <div className="flex items-center justify-around w-[100%] bg-gray-200 p-1 rounded-md">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md hover:scale-105 transition-all"
            onClick={() =>
              deleteConnectionRequest(notification, userId, "accepted")
            }
          >
            Accept
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded-md hover:scale-105 transition-all"
            onClick={() =>
              deleteConnectionRequest(notification, userId, "rejected")
            }
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

function Notifications({ notifications = [], userId }) {
  return (
    <div className="notifications max-h-[50%] overflow-scroll scrollbar-hide bg-slate-600 rounded-md p-2">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            userId={userId}
          />
        ))
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
}

export default Notifications;
