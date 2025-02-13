import { getDatabase, ref, set, get, update, remove, push, onValue, serverTimestamp, orderByChild, query } from "firebase/database";
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
            // console.log("Data added with ID:", newRef.key);
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

    // async syncGroupChatMessages(chatId) {
    //     try {
    //         const messagesPath = `chats/${chatId}/messages`;
    //         // 1. Get RTDB messages
    //         const messagesData = await this.getData(messagesPath);
    //         if (!messagesData) {
    //             return { success: false, message: "No messages found" };
    //         }

    //         // 2. Prepare Firestore batch with chunking
    //         const messageEntries = Object.entries(messagesData);
    //         const BATCH_LIMIT = 500; // Firestore's max batch size
    //         const db = dbServices.db;

    //         for (let i = 0; i < messageEntries.length; i += BATCH_LIMIT) {
    //             const batch = writeBatch(db);
    //             const chunk = messageEntries.slice(i, i + BATCH_LIMIT);

    //             chunk.forEach(([messageId, message]) => {
    //                 // Validate/sanitize document ID
    //                 const sanitizedId = messageId.replace(/\//g, '_');
    //                 const docRef = doc(db, `chats/${chatId}/messages`, sanitizedId);

    //                 // Convert timestamp to Firestore format
    //                 const firestoreMessage = {
    //                     ...message,
    //                     timestamp: message.timestamp
    //                         ? Timestamp.fromMillis(message.timestamp)  // ✅ Convert from RTDB format
    //                         : Timestamp.now(),  // ✅ Fallback to current time if missing
    //                 };


    //                 batch.set(docRef, firestoreMessage, { merge: true }); // ✅ Prevents overwriting old messages
    //             });

    //             await batch.commit();
    //             console.log(`Committed batch ${i / BATCH_LIMIT + 1}`);
    //         }

    //         // 3. Delete from RTDB only after successful sync
    //         await this.deleteData(messagesPath);
    //         console.log(`Synced ${messageEntries.length} messages and cleaned RTDB`);

    //         return { success: true, count: messageEntries.length };
    //     } catch (error) {
    //         console.error("Sync failed:", error);
    //         throw new Error(`Message sync failed: ${error.message}`);
    //     }
    // }


    // --------------------------- try adding 10 messages instead deleting all ---------------------------

    // async syncGroupChatMessages(chatId) {
    //     try {
    //         const messagesPath = `chats/${chatId}/messages`;

    //         // 1. Get RTDB messages
    //         const messagesData = await this.getData(messagesPath);
    //         if (!messagesData) {
    //             return { success: false, message: "No messages found" };
    //         }

    //         // Convert messages to an array and sort by timestamp (ascending)
    //         const messageEntries = Object.entries(messagesData)
    //             .map(([messageId, message]) => ({ id: messageId, ...message }))
    //             .sort((a, b) => a.timestamp - b.timestamp); // Oldest first

    //         if (messageEntries.length <= 10) {
    //             console.log("Less than 10 messages, no need to sync.");
    //             return { success: true, count: 0 };
    //         }

    //         // 2. Separate recent and old messages
    //         const recentMessages = messageEntries.slice(-10); // Keep last 10 messages
    //         const oldMessages = messageEntries.slice(0, -10); // Move older messages

    //         // 3. Save old messages to Firestore in batches
    //         const BATCH_LIMIT = 500;
    //         const db = dbServices.db;
    //         const batchPromises = [];

    //         for (let i = 0; i < oldMessages.length; i += BATCH_LIMIT) {
    //             const batch = writeBatch(db);
    //             const chunk = oldMessages.slice(i, i + BATCH_LIMIT);

    //             chunk.forEach((message) => {
    //                 const sanitizedId = message.id.replace(/\//g, '_');
    //                 const docRef = doc(db, `chats/${chatId}/messages`, sanitizedId);

    //                 batch.set(docRef, {
    //                     ...message,
    //                     timestamp: message.timestamp && !isNaN(message.timestamp)
    //                         ? Timestamp.fromMillis(message.timestamp)
    //                         : Timestamp.now(),
    //                 }, { merge: true });
    //             });

    //             batchPromises.push(batch.commit()); // ✅ Run batch commits in parallel
    //         }

    //         await Promise.all(batchPromises);
    //         console.log(`Synced ${oldMessages.length} messages to Firestore`);

    //         // 4. **Clear all messages from RTDB**
    //         await this.deleteAllData(messagesPath);
    //         console.log(`Cleared all messages from RTDB`);

    //         // 5. **Reinsert only the last 10 messages**
    //         const updates = {};
    //         recentMessages.forEach((msg) => {
    //             updates[`${messagesPath}/${msg.id}`] = msg;
    //         });

    //         await update(ref(this.rtdb), updates);
    //         console.log(`Reinserted the latest 10 messages into RTDB`);

    //         return { success: true, count: oldMessages.length };
    //     } catch (error) {
    //         console.error("Sync failed:", error);
    //         throw new Error(`Message sync failed: ${error.message}`);
    //     }
    // }

    // // Utility function to delete all messages at a path
    // async deleteAllData(path) {
    //     try {
    //         await set(ref(this.rtdb, path), null); // ✅ Firebase way to delete all data at a path
    //         console.log(`Deleted all messages at ${path}`);
    //     } catch (error) {
    //         console.error("Error deleting all messages:", error);
    //         throw new Error("Failed to delete messages");
    //     }
    // }


    async syncGroupChatMessages(chatId) {
        try {
            const messagesPath = `chats/${chatId}/messages`;
    
            const messagesQuery = query(
                ref(this.rtdb, `chats/${chatId}/messages`),
                orderByChild("timestamp")
            );
    
            const snapshot = await get(messagesQuery);
    
            if (!snapshot.exists()) {
                return { success: false, message: "No messages found" };
            }
    
            const messageEntries = Object.entries(snapshot.val()).map(([id, msg]) => ({ id, ...msg }));
    
            if (messageEntries.length <= 10) {
                console.log("Less than 10 messages, no need to sync.");
                return { success: true, count: 0 };
            }
    
            // Separate old and recent messages
            const recentMessages = messageEntries.slice(-10); // Keep last 10 messages
            const oldMessages = messageEntries.slice(0, -10); // Move older messages
    
            // Prepare Firestore batch with chunking
            const BATCH_LIMIT = 500;
            const db = dbServices.db;
    
            for (let i = 0; i < oldMessages.length; i += BATCH_LIMIT) {
                const batch = writeBatch(db);
                const chunk = oldMessages.slice(i, i + BATCH_LIMIT);
    
                for (const message of chunk) {
                    const sanitizedId = message.id.replace(/\//g, '_');
                    const docRef = doc(db, `chats/${chatId}/messages`, sanitizedId);
    
                    const firestoreMessage = {
                        ...message,
                        timestamp: message.timestamp
                            ? Timestamp.fromMillis(message.timestamp)
                            : Timestamp.now(),
                    };
    
                    batch.set(docRef, firestoreMessage, { merge: true });
    
                    // Check if the message contains fileData and store it in the media subcollection
                    if (message.fileData) {
                        const mediaRef = doc(db, `chats/${chatId}/media`, sanitizedId);
                        batch.set(mediaRef, {
                            ...message.fileData,
                            associatedMessageId: sanitizedId,
                            createdAt: Timestamp.now(),
                        });
                    }
                }
    
                await batch.commit();
                console.log(`Committed batch ${i / BATCH_LIMIT + 1}`);
            }
    
            // Delete only old messages from RTDB, keep the latest 10
            const deletePaths = oldMessages.map((msg) => `${messagesPath}/${msg.id}`);
            await this.deleteMultipleData(deletePaths);
    
            console.log(`Synced ${oldMessages.length} messages and kept the latest 10 in RTDB`);
    
            return { success: true, count: oldMessages.length };
        } catch (error) {
            console.error("Sync failed:", error);
            throw new Error(`Message sync failed: ${error.message}`);
        }
    }
    
    async deleteMultipleData(paths) {
        const updates = {};

        paths.forEach((path) => {
            updates[path] = null; // Setting a path to null deletes it
        });

        try {
            await update(ref(this.rtdb), updates); // ✅ Use correct Firebase RTDB syntax
            console.log(`Deleted ${paths.length} messages from RTDB`);
        } catch (error) {
            console.error("Error deleting messages:", error);
            throw new Error("Failed to delete messages");
        }
    }
}

const rtdbServices = new RTDB();
export default rtdbServices;
