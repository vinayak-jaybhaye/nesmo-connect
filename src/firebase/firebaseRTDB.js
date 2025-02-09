import { getDatabase, ref, set, get, update, remove, push, onValue, serverTimestamp } from "firebase/database";
import app from "./firebaseConfig.js";
import dbServices from "./firebaseDb.js";  // db = dbServices.db
import { writeBatch, doc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore"; // Timestamp.now()      

class RTDB {
    rtdb;
    constructor() {
        this.rtdb = getDatabase(app);
    }

    // Add data to a specific path (similar to adding a document)
    async addData(path, data) {
        try {
            const dbRef = ref(this.rtdb, path);
            await set(dbRef, { ...data, timestamp: serverTimestamp() });
            console.log("Data successfully added to", path);
        } catch (error) {
            console.error("RTDB Services : addData ::", error);
            throw error;
        }
    }

    // Add data with an auto-generated ID
    async addWithAutoId(path, data) {
        try {
            const dbRef = ref(this.rtdb, path);
            const newRef = push(dbRef);
            await set(newRef, { ...data, timestamp: serverTimestamp() });
            console.log("Data added with ID:", newRef.key);
            return newRef.key; // Return the generated key
        } catch (error) {
            console.error("RTDB Services : addWithAutoId ::", error);
            throw error;
        }
    }

    // Retrieve data from a specific path
    async getData(path) {
        try {
            const dbRef = ref(this.rtdb, path);
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("No data found at", path);
                return null;
            }
        } catch (error) {
            console.error("RTDB Services : getData ::", error);
            throw error;
        }
    }

    // Update data at a specific path
    async updateData(path, updatedData) {
        try {
            const dbRef = ref(this.rtdb, path);
            await update(dbRef, updatedData);
            console.log("Data successfully updated at", path);
        } catch (error) {
            console.error("RTDB Services : updateData ::", error);
            throw error;
        }
    }

    // Delete data from a specific path
    async deleteData(path) {
        try {
            const dbRef = ref(this.rtdb, path);
            await remove(dbRef);
            console.log("Data successfully deleted from", path);
        } catch (error) {
            console.error("RTDB Services : deleteData ::", error);
            throw error;
        }
    }

    // Listen for real-time changes (e.g., for chat messages)
    listenForChanges(path, callback) {
        try {
            const dbRef = ref(this.rtdb, path);
            onValue(dbRef, (snapshot) => {
                if (snapshot.exists()) {
                    callback(snapshot.val());
                } else {
                    callback(null);
                }
            });
        } catch (error) {
            console.error("RTDB Services : listenForChanges ::", error);
            throw error;
        }
    }

    async syncGroupChatMessages(chatId) {
        try {
            const messagesPath = `chats/${chatId}/messages`;

            // 1. Get RTDB messages
            const messagesData = await this.getData(messagesPath);
            if (!messagesData) {
                return { success: false, message: "No messages found" };
            }

            // 2. Prepare Firestore batch with chunking
            const messageEntries = Object.entries(messagesData);
            const BATCH_LIMIT = 500; // Firestore's max batch size
            const db = dbServices.db;

            for (let i = 0; i < messageEntries.length; i += BATCH_LIMIT) {
                const batch = writeBatch(db);
                const chunk = messageEntries.slice(i, i + BATCH_LIMIT);

                chunk.forEach(([messageId, message]) => {
                    // Validate/sanitize document ID
                    const sanitizedId = messageId.replace(/\//g, '_');
                    const docRef = doc(db, `chats/${chatId}/messages`, sanitizedId);

                    // Convert timestamp to Firestore format
                    const firestoreMessage = {
                        ...message,
                        timestamp: message.timestamp
                            ? Timestamp.fromMillis(message.timestamp)  // ✅ Convert from RTDB format
                            : Timestamp.now(),  // ✅ Fallback to current time if missing
                    };


                    batch.set(docRef, firestoreMessage, { merge: true }); // ✅ Prevents overwriting old messages
                });

                await batch.commit();
                console.log(`Committed batch ${i / BATCH_LIMIT + 1}`);
            }

            // 3. Delete from RTDB only after successful sync
            await this.deleteData(messagesPath);
            console.log(`Synced ${messageEntries.length} messages and cleaned RTDB`);

            return { success: true, count: messageEntries.length };
        } catch (error) {
            console.error("Sync failed:", error);
            throw new Error(`Message sync failed: ${error.message}`);
        }
    }

}

const rtdbServices = new RTDB();
export default rtdbServices;
