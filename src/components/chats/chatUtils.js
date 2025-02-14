import rtdbServices from "../../firebase/firebaseRTDB";
import appwriteStorage from "../../appwrite/appwriteStorage";
import dbServices from "../../firebase/firebaseDb";
import CryptoJS from "crypto-js";


const getFormattedTime = (timestamp) => {
  let millis;

  if (typeof timestamp === "number") {
    millis = timestamp; // Already in milliseconds
  } else if (
    timestamp?.seconds !== undefined &&
    timestamp?.nanoseconds !== undefined
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

const deleteMessage = async (chatId, message) => {
  try {
    if (message.fileData) {
      await appwriteStorage.deleteFile(message.fileData.fileId);
      console.log("File deleted successfully:", message.fileData);
    }
    if (typeof message.timestamp === "number") {
      const messageId = message.id;
      await rtdbServices.deleteData(`chats/${chatId}/messages/${messageId}`);
    } else {
      await dbServices.deleteMessage(chatId, message);
    }
  } catch (error) {
    console.error("Error deleting message:", error);
  }
}


async function sendMessage(messagesPath, newMessage = "", userData, file = null) {
  if ((!newMessage.trim() && !file) || !userData) return
  try {
    let fileData = null;
    //  Handle file upload if provided
    if (file) {
      const fileInfo = await appwriteStorage.uploadFile(file);

      if (!fileInfo || !fileInfo.$id) {
        throw new Error("File upload failed.");
      }

      const fileId = fileInfo.$id;
      let fileUrl = null;
      const fileType = file.type;

      if (fileType.startsWith("image")) {
        fileUrl = fileType === "image/webp"
          ? appwriteStorage.getFileView(fileId)
          : appwriteStorage.getFilePreview(fileId);
      } else if ([
        "application/pdf",
        "text/plain",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
      ].includes(fileType)) {
        fileUrl = appwriteStorage.getFileView(fileId);
      } else if ([
        "audio/mpeg",      // mp3
        "audio/wav",       // wav
        "audio/ogg",       // ogg
        "audio/flac",      // flac
        "audio/aac",       // aac
        "audio/mp4"        // m4a
      ].includes(fileType)) {
        fileUrl = appwriteStorage.getFileView(fileId);
      } else if ([
        "video/mp4",       // mp4
        "video/webm",      // webm
        "video/ogg",       // ogg
        "video/x-matroska" // mkv
      ].includes(fileType)) {
        fileUrl = appwriteStorage.getFileView(fileId);
      } else {
        fileUrl = appwriteStorage.getFileDownload(fileId);
      }

      fileData = { fileId, fileUrl, fileType: file.type };
    }
    const messageData = {
      ...(fileData && { fileData }),
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
  // console.log(SECRET_KEY);
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}

// Decrypt message
function decryptMessage(encryptedMessage) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export { getFormattedTime, sendMessage, encryptMessage, decryptMessage, deleteMessage };
