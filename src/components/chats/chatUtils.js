import rtdbServices from "../../firebase/firebaseRTDB";

  const getFormattedTime = (timestamp) => {
    let millis;

    if (typeof timestamp === "number") {
      millis = timestamp; // Already in milliseconds ✅
    } else if (
      timestamp.seconds !== undefined &&
      timestamp.nanoseconds !== undefined
    ) {
      millis =
        timestamp.seconds * 1000 + Math.round(timestamp.nanoseconds / 1e6);
    } else {
      return "Invalid timestamp"; // Handle unexpected cases
    }

    return new Date(millis).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  async function sendMessage(messagesPath, newMessage, userData) {
    if (!newMessage.trim() || !userData) return;
    try {
      const messageData = {
        senderId: userData.uid,
        senderName: userData.name,
        text: newMessage.trim(),
        timestamp: Date.now(),
      };
      await rtdbServices.addWithAutoId(messagesPath, messageData);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  export { getFormattedTime, sendMessage };
