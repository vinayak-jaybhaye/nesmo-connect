import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, collection, addDoc, query, where, arrayUnion, arrayRemove, writeBatch } from "firebase/firestore";
import app from './firebaseConfig.js';

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
                const profile = docSnap.data();
                return profile;
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
            const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            console.log("Users fetched successfully:", users);
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

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
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
                    return postSnap.exists() ? { id: postSnap.id, ...postSnap.data() } : null;
                })
            );

            // Remove any null values (in case some posts were deleted)
            return posts.filter(post => post !== null);
        } catch (error) {
            console.error("Error fetching user posts:", error);
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

            querySnapshot.forEach(doc => {
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

            querySnapshot.forEach(doc => {
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

    async sendConnectionRequest(senderData, receiverId) {
        try {
            const senderId = senderData.uid;
            const senderRef = doc(this.db, "users", senderId);
            const receiverRef = doc(this.db, "users", receiverId);

            // Prevent duplicate requests
            if (senderData.connectionRequests?.some(req => req.other === receiverId)) {
                console.warn("Connection request already sent.");
                return;
            }

            // Add to both users' connectionRequests array
            await updateDoc(senderRef, {
                connectionRequests: arrayUnion({ type: "sent", other: receiverId })
            });

            await updateDoc(receiverRef, {
                connectionRequests: arrayUnion({ type: "received", other: senderId })
            });

            await updateDoc(receiverRef, {
                notifications: arrayUnion({
                    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
                    type: "connectionRequest",
                    other: senderId,
                    content: `${senderData.name} wants to Connect!`
                })
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
                notifications: arrayRemove(notification) // Directly remove the exact object
            });

            console.log("Notification deleted successfully!");
        } catch (error) {
            console.error("Error deleting notification:", error);
            throw error;
        }
    }

    async handleConnectionRequest(status, senderId, receiverId) {
        try {
            const senderRef = doc(this.db, "users", senderId);
            const receiverRef = doc(this.db, "users", receiverId);

            
            const Request1 = { type: "sent", other: receiverId };  // Request in sender's connectionRequests
            const Request2 = { type: "received", other: senderId }; // Request in receiver's connectionRequests

            // Batch update to minimize Firestore calls
            const batch = writeBatch(this.db);

            // Remove connection request from sender's connectionRequests
            batch.update(senderRef, {
                connectionRequests: arrayRemove(Request1)
            });

            // Remove connection request from receiver's connectionRequests
            batch.update(receiverRef, {
                connectionRequests: arrayRemove(Request2)
            });

            // If Status is "accepted", add to both users' connections
            if (status === "accepted") {
                batch.update(senderRef, {
                    connections: arrayUnion(receiverId)
                });
                batch.update(receiverRef, {
                    connections: arrayUnion(senderId)
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

}

const dbServices = new DB();
export default dbServices;
