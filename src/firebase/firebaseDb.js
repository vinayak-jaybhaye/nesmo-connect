import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    collection,
    addDoc,
    query,
    where,
    arrayUnion,
    arrayRemove,
    writeBatch,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    endBefore
} from "firebase/firestore";
import app from "./firebaseConfig.js";
import { decryptMessage } from "../components/chats/chatUtils.js";


class DB {
    db;
    constructor() {
        this.db = getFirestore(app);
    }

    // add document to collection
    async addDocument(collectionName, docId, data) {
        try {
            await setDoc(doc(this.db, collectionName, docId), data);
            console.log("Document successfully written!");
        } catch (error) {
            console.error("Firebase DB services : addDocument :: ", error);
            throw error;
        }
    }

    // retrive document from collection
    async getDocument(collectionName, docId) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const oneDoc = docSnap.data();
                return oneDoc;
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Firebase DB services : getDocument ::", error);
            throw error;
        }
    }

    // update document from collection
    async updateDocument(collectionName, docId, updatedData) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            await updateDoc(docRef, updatedData);
            console.log("Document successfully updated!");
        } catch (error) {
            console.error("Firebase DB services : updateDocument ::", error);
            throw error;
        }
    }

    // delete document from collection
    async deleteDocument(collectionName, docId) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            await deleteDoc(docRef);
            console.log("Document successfully deleted!");
        } catch (error) {
            console.error("Firebase DB services : deleteDocument ::", error);
            throw error;
        }
    }

    // add document with auto generated id
    async addWithAutoId(collectionName, data) {
        try {
            const colRef = collection(this.db, collectionName);
            data.createdBy = doc(this.db, "users", data.createdBy);
            const docRef = await addDoc(colRef, data);
            console.log("Document written with ID: ", docRef.id);
            return docRef;
        } catch (error) {
            console.error("Firebase DB services : addWithAutoId ::", error);
            throw error;
        }
    }

    // get all alumni
    async getAllAlumni() { }

    // get all users
    async getAllDocuments(collectionName) {
        try {
            const usersCollection = collection(this.db, collectionName);
            const querySnapshot = await getDocs(usersCollection);
            const users = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // console.log("Users fetched successfully:", users);
            return users;
        } catch (error) {
            console.error("Error fetching users:", error.message);
            throw error;
        }
    }

    async getAllPosts(userId = null) {
        try {
            const postsCollection = collection(this.db, "posts");

            // If userId is provided, filter posts by "createdBy"
            const queryRef = userId
                ? query(postsCollection, where("createdBy", "==", userId))
                : postsCollection;

            const querySnapshot = await getDocs(queryRef);

            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        }
    }

    async getMyPosts(userId) {
        try {
            // Fetch user document
            const userDoc = await this.getDocument("users", userId);

            // Get post references
            const postRefs = userDoc?.posts || [];

            // Fetch all posts using their references
            const posts = await Promise.all(
                postRefs.map(async (postRef) => {
                    const postSnap = await getDoc(postRef);
                    return postSnap.exists()
                        ? { id: postSnap.id, ...postSnap.data() }
                        : null;
                })
            );

            // Remove any null values (in case some posts were deleted)
            return posts.filter((post) => post !== null);
        } catch (error) {
            console.error("Error fetching user posts:", error);
            return [];
        }
    }

    async getSavedPosts(userId) {
        try {
            // Fetch user document
            const userDoc = await this.getDocument("users", userId);
            let savedPosts = userDoc?.savedPosts || [];

            if (savedPosts.length === 0) return [];

            const postsCollection = collection(this.db, "posts");

            // Firestore limits `where("in")` to 10 items, so we batch if necessary
            const batchSize = 10;
            const batches = [];
            for (let i = 0; i < savedPosts.length; i += batchSize) {
                const batchIds = savedPosts.slice(i, i + batchSize);
                const q = query(postsCollection, where("__name__", "in", batchIds));
                batches.push(getDocs(q));
            }

            // Execute all queries in parallel
            const results = await Promise.all(batches);

            // Extract valid posts and their IDs
            const validPosts = [];
            const foundPostIds = new Set();

            results.forEach((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    validPosts.push({ id: doc.id, ...doc.data() });
                    foundPostIds.add(doc.id);
                });
            });

            // Find missing post IDs
            const missingPostIds = savedPosts.filter(
                (postId) => !foundPostIds.has(postId)
            );

            // If there are missing posts, update the user document
            if (missingPostIds.length > 0) {
                const updatedSavedPosts = savedPosts.filter(
                    (postId) => !missingPostIds.includes(postId)
                );
                console.warn("Some saved posts were not found:", missingPostIds);
                const userRef = doc(this.db, "users", userId);
                const batch = writeBatch(this.db);
                batch.update(userRef, { savedPosts: updatedSavedPosts });
                await batch.commit();
            }

            return validPosts;
        } catch (error) {
            console.error("Error fetching saved posts:", error);
            return [];
        }
    }

    async updateLikes(postId, userId, likedStatus) {
        try {
            const likeDocRef = doc(this.db, `posts/${postId}/likes`, userId);

            if (likedStatus === null) {
                // If likedStatus is null, remove the like document
                await deleteDoc(likeDocRef);
            } else {
                // Otherwise, set or update the like document with likedStatus
                await setDoc(likeDocRef, { likedStatus });
            }
        } catch (error) {
            console.error("Error updating likes:", error);
            throw error;
        }
    }

    async getLikedStatus(postId, userId) {
        try {
            const likeDocRef = doc(this.db, `posts/${postId}/likes`, userId);
            const likeDocSnap = await getDoc(likeDocRef);

            return likeDocSnap.exists() ? likeDocSnap.data().likedStatus : null;
        } catch (error) {
            console.error("Error fetching liked status:", error);
            return null;
        }
    }

    async getLikesAndDislikes(postId) {
        try {
            const likesCollection = collection(this.db, `posts/${postId}/likes`);
            const querySnapshot = await getDocs(likesCollection);

            let likes = 0;
            let dislikes = 0;

            querySnapshot.forEach((doc) => {
                const likedStatus = doc.data().likedStatus;
                if (likedStatus === "liked") {
                    likes++;
                } else if (likedStatus === "disliked") {
                    dislikes++;
                }
            });

            return { likes, dislikes };
        } catch (error) {
            console.error("Error fetching likes and dislikes:", error);
            return { likes: 0, dislikes: 0 };
        }
    }

    async getPostsByLikes() {
        try {
            const postsCollection = collection(this.db, "posts");
            const querySnapshot = await getDocs(postsCollection);

            let posts = [];

            querySnapshot.forEach((doc) => {
                posts.push({ id: doc.id, ...doc.data() });
            });

            posts.sort((a, b) => {
                const aLikes = a.likes || 0;
                const bLikes = b.likes || 0;

                return bLikes - aLikes;
            });

            return posts;
        } catch (error) {
            console.error("Error fetching posts by likes:", error);
            return [];
        }
    }

    async getLikedUsers(postId) {
        try {
            const likesCollection = collection(this.db, `posts/${postId}/likes`);

            // 🔍 Only fetch documents where likedStatus is "liked"
            const q = query(likesCollection, where("likedStatus", "==", "liked"));
            const querySnapshot = await getDocs(q);

            let likedUsers = [];

            querySnapshot.forEach(async (likeDoc) => {
                const userId = likeDoc.id; // Assuming doc ID is the user ID
                const userRef = doc(this.db, "users", userId); // Reference to the user document
                const userSnap = await getDoc(userRef); // Fetch user document

                if (userSnap.exists()) {
                    const userName = userSnap.data().name; // Extract name from user document
                    likedUsers.push({ id: userId, name: userName }); // Push { id, name } to array
                } else {
                    likedUsers.push({ id: userId, name: "Unknown" }); // Handle missing user
                }
            });

            return likedUsers;
        } catch (error) {
            console.error("Error fetching liked users:", error);
            return [];
        }
    }

    async sendConnectionRequest(senderData, recieverData) {
        try {
            const senderId = senderData.uid;
            const receiverId = recieverData.uid;
            const senderRef = doc(this.db, "users", senderId);
            const receiverRef = doc(this.db, "users", receiverId);
            console.log(receiverId);

            // Prevent duplicate requests
            if (
                senderData.connectionRequests?.some((req) => req.other === receiverId)
            ) {
                console.warn("Connection request already sent.");
                return;
            }

            // Add to both users' connectionRequests array
            await updateDoc(senderRef, {
                connectionRequests: arrayUnion({
                    type: "sent",
                    other: receiverId,
                    otherName: recieverData.name,
                    otherAvatar: recieverData?.avatarUrl || "",
                }),
            });

            await updateDoc(receiverRef, {
                connectionRequests: arrayUnion({
                    type: "received",
                    other: senderId,
                    otherName: senderData.name,
                    otherAvatar: senderData?.avatarUrl || "",
                }),
            });

            await updateDoc(receiverRef, {
                notifications: arrayUnion({
                    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
                    type: "connectionRequest",
                    otherName: senderData.name,
                    otherAvatar: senderData?.avatarUrl || "",
                    other: senderId,
                    content: `${senderData.name} wants to Connect!`,
                }),
            });

            console.log("Connection request sent successfully!");
        } catch (error) {
            console.error("Error sending connection request:", error);
            throw error;
        }
    }

    async deleteNotification(notification, userId) {
        try {
            const userRef = doc(this.db, "users", userId);

            await updateDoc(userRef, {
                notifications: arrayRemove(notification), // Directly remove the exact object
            });

            console.log("Notification deleted successfully!");
        } catch (error) {
            console.error("Error deleting notification:", error);
            throw error;
        }
    }

    async handleConnectionRequest(status, notification, userData) {
        try {
            const senderId = notification.other;
            const receiverId = userData.uid;
            const senderRef = doc(this.db, "users", senderId);
            const receiverRef = doc(this.db, "users", receiverId);

            const Request1 = {
                type: "sent",
                other: receiverId,
                otherName: userData.name,
                otherAvatar: userData?.avatarUrl || "",
            }; // Request in sender's connectionRequests
            const Request2 = {
                type: "received",
                other: senderId,
                otherName: notification.otherName,
                otherAvatar: notification?.otherAvatar || "",
            }; // Request in receiver's connectionRequests

            // Batch update to minimize Firestore calls
            const batch = writeBatch(this.db);

            // Remove connection request from sender's connectionRequests
            batch.update(senderRef, {
                connectionRequests: arrayRemove(Request1),
            });

            // Remove connection request from receiver's connectionRequests
            batch.update(receiverRef, {
                connectionRequests: arrayRemove(Request2),
            });

            delete Request1.type;
            delete Request2.type;
            // If Status is "accepted", add to both users' connections
            if (status === "accepted") {
                batch.update(senderRef, {
                    connections: arrayUnion(Request1),
                });
                batch.update(receiverRef, {
                    connections: arrayUnion(Request2),
                });
            }
            // Commit batch update
            await batch.commit();

            console.log("Connection request handled successfully!");
        } catch (error) {
            console.error("Error handling connection request:", error);
            throw error;
        }
    }

    async createGroupChat(chatId, members, type = "private", name) {
        try {
            const chatRef = doc(this.db, "chats", chatId);
            console.log(name);

            await setDoc(chatRef, {
                members, // Store member IDs as an array of strings
                type,
                createdAt: Date.now(),
                name,
            });

            // ✅ Add group chat ID to each member's "chats" array in the users collection
            for (const memberId of members) {
                const userRef = doc(this.db, "users", memberId);
                await updateDoc(userRef, {
                    chats: arrayUnion(chatId), // Append chatId to the user's chats array
                });
            }

            console.log("Group chat created successfully!");
        } catch (error) {
            console.error("Error creating group chat:", error);
            throw error;
        }
    }

    async addMemberToGroupChat(chatId, memberId) {
        try {
            const chatRef = doc(this.db, "chats", chatId);
            const chatSnap = await getDoc(chatRef);

            if (!chatSnap.exists()) {
                console.error("Chat does not exist!");
                return;
            }

            const chatData = chatSnap.data();
            if (chatData.members.includes(memberId)) {
                console.log("User is already in the group!");
                return;
            }

            // ✅ Add user to the group chat members array
            await updateDoc(chatRef, {
                members: arrayUnion(memberId),
            });

            // ✅ Add chat ID to the user's "chats" array in the users collection
            const userRef = doc(this.db, "users", memberId);
            await updateDoc(userRef, {
                chats: arrayUnion(chatId),
            });

            console.log(
                `Member ${memberId} added to group chat ${chatId} successfully!`
            );
        } catch (error) {
            console.error("Error adding member to group chat:", error);
            throw error;
        }
    }

    async getGroupChatMessages(chatId) {
        try {
            const messagesCollection = collection(
                this.db,
                `chats/${chatId}/messages`
            );
            const messagesQuery = query(
                messagesCollection,
                orderBy("timestamp", "asc")
            ); // Order by time

            const querySnapshot = await getDocs(messagesQuery);
            const messages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return messages;
        } catch (error) {
            console.error("Error fetching group chat messages:", error);
            return [];
        }
    }

    async getAllChats(chatIds) {
        try {
            if (!chatIds) return [];
            const chatsCollection = collection(this.db, "chats");
            const querySnapshot = await getDocs(chatsCollection);
            let chats = [];

            querySnapshot.forEach((doc) => {
                if (chatIds?.includes(doc.id)) {
                    chats.push({ id: doc.id, ...doc.data() });
                }
            });
            return chats;
        } catch (error) {
            console.error("Error fetching chats:", error);
            return [];
        }
    }

    async fetchRecentMessages(chatId, lastMessageTimestamp = null) {
        try {
            console.log("Fetching messages older than:", lastMessageTimestamp);
            const messagesCollection = collection(dbServices.db, `chats/${chatId}/messages`);
            let queryConstraints = [
                orderBy("timestamp", "desc"), // ✅ Get newest messages first
                limit(10) // ✅ Fetch the latest 10 messages
            ];

            if (lastMessageTimestamp) {
                queryConstraints.push(where("timestamp", "<", lastMessageTimestamp)); // ✅ Get messages older than last loaded
            }

            const messagesQuery = query(messagesCollection, ...queryConstraints);
            const querySnapshot = await getDocs(messagesQuery);
            let messages = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                data.text = decryptMessage(data.text);
                messages.push(data);
            });

            return messages.reverse();
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw error;
        }
    }



}

const dbServices = new DB();
export default dbServices;
