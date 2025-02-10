import rtdbServices from "../../firebase/firebaseRTDB";
import CryptoJS from "crypto-js";


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
      text: encryptMessage(newMessage.trim()),
      timestamp: Date.now(),
    };
    await rtdbServices.addWithAutoId(messagesPath, messageData);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}


const SECRET_KEY = import.meta.env.VITE_ENCRYPT_KEY;

// encrypt message
function encryptMessage(message) {
  console.log(SECRET_KEY);
  return CryptoJS.AES.encrypt(message,SECRET_KEY).toString();
}

// Decrypt message
function decryptMessage(encryptedMessage) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}



export { getFormattedTime, sendMessage, encryptMessage, decryptMessage };
