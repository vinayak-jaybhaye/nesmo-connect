import { VariableSizeList as List } from "react-window";
import { useRef, useCallback, useEffect } from "react";
import { getFormattedTime } from "./chatUtils";

const MessageList = ({ messages = [], userData }) => {
  const listRef = useRef(null);
  const containerHeight = 500;
  const isUserAtBottom = useRef(true);

  // ✅ Optimize getItemSize without useMemo (react-window needs a function, not memoized logic)
  const getItemSize = (index) => {
    const msg = messages[index];
    if (!msg) return 50;
    const baseHeight = 50;
    const extraHeight = Math.ceil(msg.text.length / 40) * 20;
    return baseHeight + extraHeight;
  };

  // ✅ Use useCallback to prevent Row from re-creating
  const Row = useCallback(
    ({ index, style }) => {
      const msg = messages[index];
      if (!msg) return null;

      return (
        <div
          style={{ ...style, height: getItemSize(index) }}
          className={`flex ${
            msg.senderId === userData?.uid ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] p-3 rounded-md m-1 ${
              msg.senderId === userData?.uid
                ? "bg-blue-900 ml-8"
                : "bg-gray-800 mr-8"
            }`}
          >
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium text-blue-400">
                {msg.senderId === userData?.uid ? "You" : msg.senderName}
              </span>
              <time className="text-xs text-gray-400 ml-2">
                {getFormattedTime(msg.timestamp)}
              </time>
            </div>
            <p className="text-gray-100 break-words">{msg.text}</p>
          </div>
        </div>
      );
    },
    [messages, userData]
  );

  // ✅ Track if user is at the bottom before updating messages
  const handleScroll = () => {
    const listElement = listRef.current?.innerRef?.current;
    if (!listElement) return;

    const { scrollTop, scrollHeight, clientHeight } = listElement;
    isUserAtBottom.current = scrollTop + clientHeight >= scrollHeight - 10;
  };

  // ✅ Auto-scroll when new messages arrive, but only if the user is at the bottom
  useEffect(() => {
    if (listRef.current && isUserAtBottom.current) {
      requestAnimationFrame(() => {
        listRef.current.scrollToItem(messages.length - 1, "smart");
      });
    }
  }, [messages.length]);

  // ✅ Attach scroll listener
  useEffect(() => {
    const listElement = listRef.current?.innerRef?.current;
    if (listElement) {
      listElement.addEventListener("scroll", handleScroll);
    }
    return () => listElement?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <List
      ref={listRef}
      height={containerHeight}
      itemCount={messages.length}
      itemSize={getItemSize}
      width="100%"
      className="bg-gray-950"
    >
      {Row}
    </List>
  );
};

export default MessageList;
