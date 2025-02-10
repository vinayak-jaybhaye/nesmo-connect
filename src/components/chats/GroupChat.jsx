import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import rtdbServices from "../../firebase/firebaseRTDB";
import { setVars } from "../../store/varSlice";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getFormattedTime, sendMessage, decryptMessage } from "./chatUtils";
import dbServices from "../../firebase/firebaseDb";

function GroupChat({ userData, chatId }) {
  const [messages, setMessages] = useState([]);
  const [oldMessages, setOldMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);

  // const chatId = useSelector((state) => state.vars.selectChat);
  // const userData = useSelector((state) => state.auth.userData);

  const inputRef = useRef(null);

  const dispatch = useDispatch();

  async function loadOlderMessages() {
    if (isLoadingOlder || loadedAll) return;
    setIsLoadingOlder(true);
    const older = await dbServices.fetchRecentMessages(
      chatId,
      lastMessageTimestamp
    );

    if (older.length > 0) {
      setOldMessages((prev) => [...older, ...prev]);

      if (older.length < 10) setLoadedAll(true);
      setLastMessageTimestamp((prev) => {
        if (older[0]?.timestamp === prev) setLoadedAll(true);
        return older[0]?.timestamp;
      });
    } else {
      setLoadedAll(true);
    }
    setIsLoadingOlder(false);
  }

  useEffect(() => {
    async function initChat() {
      try {
        const chatData = await dbServices.getDocument("chats", chatId);
        setChat(chatData);
      } catch (error) {
        setMessages([]);
        setOldMessages([]);
        setLastMessageTimestamp(null);
        console.error("Chat initialization failed:", error);
      }
    }
    if (chatId) {
      initChat();
      inputRef.current?.focus();
    }
  }, [chatId]);

  // Fetch messages from RTDB
  useEffect(() => {
    if (!chat) return;
    let unsubscribe;
    const messagesPath = `chats/${chatId}/messages`;

    const initChat = async () => {
      try {
        unsubscribe = rtdbServices.listenForChanges(
          messagesPath,
          async (data) => {
            const newMessages = data
              ? Object.entries(data).map(([id, msg]) => ({ id, ...msg }))
              : [];

            const decryptedMessages = newMessages.map((msg) => ({
              ...msg,
              text: decryptMessage(msg.text),
            }));

            setMessages(decryptedMessages);
            if (newMessages.length >= 20) {
              await rtdbServices.syncGroupChatMessages(chatId);
              setOldMessages([]);
            }
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error("Chat initialization failed:", error);
        setIsLoading(false);
      }
    };

    initChat();
    return () => unsubscribe?.();
  }, [chatId, chat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(`chats/${chatId}/messages`, newMessage, userData);
    setNewMessage("");
    setIsSending(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div
      className="flex flex-col h-full w-full bg-gray-900 rounded-lg shadow-xl overflow-hidden"
      key={chatId}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-slate-600">
        <h2 className="text-lg font-semibold truncate text-gray-200">
          {chat?.type === "private"
            ? chat?.name[0] === userData?.name
              ? chat?.name[1]
              : chat?.name[0]
            : chat?.name || "Group Chat"}
        </h2>
        <button
          onClick={() => dispatch(setVars({ selectChat: null }))}
          className="p-2 text-gray-200 hover:text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          aria-label="Close chat"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 bg-black">
        {isLoadingOlder ? (
          <div className="text-center text-sm text-gray-500 py-2">
            Loading older messages...
          </div>
        ) : (
          <div
            className="text-center text-sm text-gray-500 py-2 cursor-pointer"
            onClick={loadOlderMessages}
          >
            {loadedAll ? "No more messages" : "Load older messages..."}
          </div>
        )}

        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading messages...
          </div>
        ) : (
          [...oldMessages, ...messages].map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === userData?.uid ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  msg.senderId === userData?.uid
                    ? "bg-blue-900 ml-8"
                    : "bg-gray-800 mr-8"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-blue-400">
                    {msg.senderId === userData?.uid ? "You" : msg.senderName}
                  </span>
                  <time className="text-xs text-gray-400">
                    {getFormattedTime(msg.timestamp)}
                  </time>
                </div>
                <p className="text-gray-100 break-words">{msg.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-700 bg-transparent"
      >
        <div className="flex gap-2 bg-transparent">
          <input
            value={newMessage}
            ref={inputRef}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            disabled={isSending}
          />
          <button
            type="submit"
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isSending || !newMessage.trim()
                ? "bg-gray-600 opacity-50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isSending || !newMessage.trim()}
          >
            <PaperAirplaneIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}
export default GroupChat;
