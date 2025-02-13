import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import rtdbServices from "../../firebase/firebaseRTDB";
import { setVars } from "../../store/varSlice";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { sendMessage, decryptMessage } from "./chatUtils";
import dbServices from "../../firebase/firebaseDb";
import Message from "./Message";
import { AttachmentIcon, FileTypeIcon } from "./helperComponents";

function GroupChat({ userData, chatId }) {
  const [messages, setMessages] = useState([]);
  const [oldMessages, setOldMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
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
            if (newMessages.length > 11) {
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
    await sendMessage(`chats/${chatId}/messages`, newMessage, userData, file);
    setNewMessage("");
    setFile(null);
    setIsSending(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleAddFile = (e) => {
    e.preventDefault();
    const input = document.createElement("input");
    input.type = "file";

    // ✅ Supports images, audio, video, documents, and zip files
    input.accept =
      "image/*,audio/*,video/*,.mp3,.wav,.aac,.ogg,.flac,.m4a,.mp4,.mkv,.avi,.mov,.wmv,.flv,.webm,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setFile(file);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    };
    input.onkeydown = (e) => e.preventDefault();
    input.click();
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
            <Message
              key={msg.id}
              msg={msg}
              userData={userData}
              chatId={chatId}
            />
          ))
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-2 border-t border-gray-700 bg-transparent flex w-full justify-around"
      >
        {file && (
          <div className="relative group border border-gray-700 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-600">
            {/* Preview content */}
            <div className="relative">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Upload preview"
                  className="w-20 h-20 object-cover rounded-xl"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-800 flex items-center justify-center">
                  <FileTypeIcon
                    mimeType={file.type}
                    className="w-8 h-8 text-gray-400"
                  />
                </div>
              )}

              {/* Close button */}
              <button
                onClick={() => setFile(null)}
                className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-150 transform scale-100"
                aria-label="Remove file"
              >
                <XMarkIcon className="w-3" />
              </button>
            </div>

            {/* File info */}
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-gray-900/90 to-transparent">
              <div className="flex items-center gap-1 text-xs text-white">
                <span className="truncate">{file.name}</span>
                <span className="text-gray-400 text-xxs">
                  ({(file.size / 1024).toFixed(1)}KB)
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-600/50 rounded-xl transition-all group"
            onClick={handleAddFile}
          >
            {/* <AttachmentIcon className="w-4 h-4 text-gray-400" /> */}
            <img src="/attachments.svg" className="w-6" />
          </button>
        </div>
        <div className="flex gap-2 bg-transparent w-[90%]">
          <input
            value={newMessage}
            ref={inputRef}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700  text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 "
            disabled={isSending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // to prevent file upload on enter
                handleSendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isSending || (!newMessage.trim() && !file)
                ? "bg-gray-600 opacity-50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isSending || (!newMessage.trim() && !file)}
          >
            <PaperAirplaneIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}
export default GroupChat;
