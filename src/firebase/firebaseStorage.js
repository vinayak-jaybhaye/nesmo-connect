import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import app from './firebaseConfig.js';

class Storage {
  storage;
  constructor() {
    this.storage = getStorage(app);
  }

  // Upload a file
  async uploadFile(file, path) {
    try {
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("File uploaded successfully:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error.message);
      throw error;
    }
  }

  // Get file URL
  async getFileURL(path) {
    try {
      const fileRef = ref(this.storage, path);
      const url = await getDownloadURL(fileRef);
      console.log("File URL retrieved:", url);
      return url;
    } catch (error) {
      console.error("Error retrieving file URL:", error.message);
      throw error;
    }
  }

  // Delete a file
  async deleteFile(path) {
    try {
      const fileRef = ref(this.storage, path);
      await deleteObject(fileRef);
      console.log("File deleted successfully:", path);
    } catch (error) {
      console.error("Error deleting file:", error.message);
      throw error;
    }
  }

  // List all files in a directory
  async listFiles(directoryPath) {
    try {
      const dirRef = ref(this.storage, directoryPath);
      const result = await listAll(dirRef);
      const filePaths = result.items.map((item) => item.fullPath);
      console.log("Files in directory:", filePaths);
      return filePaths;
    } catch (error) {
      console.error("Error listing files:", error.message);
      throw error;
    }
  }
}

const storageServices = new Storage();
export default storageServices;