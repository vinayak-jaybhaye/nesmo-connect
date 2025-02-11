import {
  DeleteIcon,
  MenuIcon,
  getMessageBubbleClasses,
} from "./helperComponents";
import RenderFile from "./helperComponents";
import { getFormattedTime, deleteMessage } from "./chatUtils";
import { useState } from "react";

function Message({ msg, userData, chatId }) {
  const [showMenu, setShowMenu] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const isCurrentUser = msg.senderId === userData?.uid;

  // Handle delete functionality
  const handleDelete = async () => {
    await deleteMessage(chatId, msg);
    setShowMenu(false);
    setDeleted(true);
    setShowMenu(false);
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
    setTimeout(() => {
      setShowMenu(false);
    }, 3000);
  };

  return (
    <div
      key={msg.id}
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} ${
        deleted && "hidden"
      }  `}
    >
      <div className={getMessageBubbleClasses(isCurrentUser)}>
        <div className="relative group">
          {/* Message header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-400">
                {isCurrentUser ? "You" : msg.senderName}
              </span>
              <time className="text-xs text-gray-400">
                {getFormattedTime(msg.timestamp)}
              </time>
            </div>

            {/* Menu button */}
            {isCurrentUser && (
              <button
                onClick={toggleMenu}
                aria-label="Message actions"
                className="p-1 hover:bg-gray-700/50 rounded-full transition-colors"
              >
                <MenuIcon className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Context menu */}
          {showMenu && (
            <div className="absolute top-8 right-0 bg-gray-800 rounded-lg p-2 shadow-lg z-10">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700/50 rounded-md w-full"
              >
                <DeleteIcon className="w-4 h-4 text-red-500" />
                <span className="text-red-500 text-sm">Delete</span>
              </button>
            </div>
          )}

          {/* Message content */}
          <div className="relative">
            {msg?.fileData?.fileUrl && (
              <div className="mb-2">
                {RenderFile(msg.fileData.fileUrl, msg.fileData.fileType)}
              </div>
            )}
            <p className="text-gray-100 break-words">{msg.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
