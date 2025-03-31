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
    writeBatch,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    serverTimestamp,
    startAt,
    endAt
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

    async getDocumentByRef(docRef) {
        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const oneDoc = docSnap.data();
                return oneDoc;
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Firebase DB services : getDocumentByRef ::", error);
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

    // get all alumni
    async getAllAlumni() {
        try {
            const usersCollection = collection(this.db, "users");
            const querySnapshot = await getDocs(usersCollection);
            const alumni = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((user) => user.userRole === "alumnus");

            // console.log("Alumni fetched successfully:", alumni);
            return alumni;
        } catch (error) {
            console.error("Error fetching alumni:", error.message);
            throw error;
        }
    }

    // get all unverified users in batches of 10
    async getUnverifiedUsers(lastVisible = null, pageSize = 10) {
        try {
            const unverifiedUsersCollection = collection(this.db, "users");

            let usersQuery = query(
                unverifiedUsersCollection,
                // where("verified", "==", false),
                // orderBy("createdAt", "desc"),
                limit(pageSize)
            );

            if (lastVisible) {
                usersQuery = query(usersQuery, startAfter(lastVisible));
            }

            const querySnapshot = await getDocs(usersQuery);

            if (querySnapshot.empty) {
                return { users: [], lastVisible: null };
            }

            const users = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toLocaleString(), // Format date nicely
            }));

            const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

            console.log("Fetched users:", users);

            return { users, lastVisible: newLastVisible };
        } catch (error) {
            console.error("Error fetching unverified users:", error.message);
            throw error;
        }
    }

    // delete user from firestore
    async deleteUserFromFirestore(userId) {
        try {
            await deleteDoc(doc(this.db, 'users', userId));
            console.log('User document deleted from Firestore');
        } catch (error) {
            console.error('Error deleting user from Firestore:', error.message);
            throw error;
        }
    };

    // verify user
    async acceptUser(userId) {
        try {
            await updateDoc(doc(this.db, 'users', userId), {
                verified: true
            });
            console.log('User verified successfully');
        } catch (error) {
            console.error('Error verifying user:', error.message);
            throw error;
        }
    }


    formatFirebaseTimestamp(firebaseTimestamp) {
        if (!firebaseTimestamp || !(firebaseTimestamp instanceof Timestamp)) {
            return "Invalid timestamp";
        }
        const date = firebaseTimestamp.toDate();
        return date.toLocaleString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            // hour: "2-digit",
            // minute: "2-digit",
            hour12: true,
        });
    }


    async createPost(newPost, userId) {
        try {
            // Add post to the 'posts' collection
            newPost.createdAt = serverTimestamp();
            const postRef = await dbServices.addWithAutoId("posts", newPost);
            // Save the post reference in the 'myPosts' subcollection under the user's document
            const userPostRef = doc(dbServices.db, `users/${userId}/myPosts`, postRef.id);
            await setDoc(userPostRef, { postRef, createdAt: newPost.createdAt });
            console.log("Post added successfully!", postRef.id, newPost);
            // return post
            const createdPost = await getDoc(postRef);
            return { id: createdPost.id, ...createdPost.data() };
        } catch (error) {
            console.error("Error adding post:", error);
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

    async getRandomPosts() {
        try {
            const postsCollection = collection(this.db, "posts");

            //Get total document count for random offset
            const totalDocsSnapshot = await getDocs(postsCollection);
            const totalDocs = totalDocsSnapshot.size;
            if (totalDocs === 0) return [];

            const randomOffset = Math.floor(Math.random() * Math.max(1, totalDocs - 10));

            // Query posts with random offset
            const randomQuery = query(
                postsCollection,
                orderBy("createdAt"),
                startAfter(randomOffset), // Skip `randomOffset` documents
                limit(10)
            );

            const querySnapshot = await getDocs(randomQuery);

            // Extract posts and fetch user data
            const posts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const userFetchPromises = posts.map((post) => getDoc(post.createdBy));

            const userSnapshots = await Promise.all(userFetchPromises);

            // Inject user data into posts
            const postsWithUser = posts.map((post, index) => ({
                ...post,
                createdBy: userSnapshots[index].exists()
                    ? { id: userSnapshots[index].id, ...userSnapshots[index].data() }
                    : { id: null, name: "Unknown" }, // Handle missing user
            }));

            return postsWithUser;
        } catch (error) {
            console.error("Error fetching random posts:", error);
            return [];
        }
    }

    async getMyPosts(userId, lastVisible = null, pageSize = 10) {
        try {
            const myPostsCollection = collection(this.db, `users/${userId}/myPosts`);

            let postsQuery = query(
                myPostsCollection,
                orderBy("createdAt", "desc"),
                limit(pageSize)
            );

            if (lastVisible) {
                postsQuery = query(postsQuery, startAfter(lastVisible));
            }

            const querySnapshot = await getDocs(postsQuery);
            if (querySnapshot.empty) return { posts: [], lastVisible: null };

            // Extract post references
            const myPostDocs = querySnapshot.docs;
            const postRefs = myPostDocs.map((doc) => doc.data().postRef);

            // Fetch actual posts from `posts` collection using references
            const postFetchPromises = postRefs.map((postRef) => getDoc(postRef));
            const postSnapshots = await Promise.all(postFetchPromises);

            // Process valid posts
            const posts = postSnapshots
                .filter((snap) => snap.exists())
                .map((snap) => ({
                    id: snap.id,
                    ...snap.data(),
                }));

            const newLastVisible = myPostDocs[myPostDocs.length - 1];

            return { posts, lastVisible: newLastVisible };
        } catch (error) {
            console.error("Error fetching user posts:", error);
            return { posts: [], lastVisible: null };
        }
    }

    async getMyPostRefs(userId) {
        try {
            // Query the "myPosts" subcollection in the user's document
            const myPostsCollection = collection(this.db, `users/${userId}/myPosts`);
            const myPostsSnapshot = await getDocs(myPostsCollection);

            // Extract and return only post references
            return myPostsSnapshot.docs.map((doc) => doc.data().postRef);
        } catch (error) {
            console.error("Error fetching user post references:", error);
            return [];
        }
    }

    async fetchPostsFromRefs(postRefs) {
        return Promise.all(
            postRefs.map(async (postRef) => {
                const postSnap = await getDoc(postRef);
                return postSnap.exists() ? { id: postSnap.id, ...postSnap.data() } : null;
            })
        ).then((posts) => posts.filter((post) => post !== null));
    }

    async toggleSavePost(userId, postId) {
        try {
            const savedPostRef = doc(this.db, `users/${userId}/savedPosts`, postId);
            const savedPostSnap = await getDoc(savedPostRef);

            if (savedPostSnap.exists()) {
                await deleteDoc(savedPostRef);
                return { saved: false, message: "Post removed from saved posts!" };
            } else {
                await setDoc(savedPostRef, {
                    postRef: doc(this.db, "posts", postId),
                    savedAt: serverTimestamp(),
                });
                return { saved: true, message: "Post saved successfully!" };
            }
        } catch (error) {
            console.error("Error toggling saved post:", error);
            return { success: false, message: "An error occurred." };
        }
    }

    async isPostSaved(userId, postId) {
        try {
            const savedPostRef = doc(this.db, `users/${userId}/savedPosts/${postId}`);
            const savedPostSnap = await getDoc(savedPostRef);

            return savedPostSnap.exists(); // true if the post is saved
        } catch (error) {
            console.error("Error checking saved post:", error);
            return false; // false in case of an error
        }
    }

    async deletePost(postId, userId) {
        try {
            const postRef = doc(this.db, "posts", postId);
            const userPostRef = doc(this.db, `users/${userId}/myPosts`, postId);
            const likesCollectionRef = collection(this.db, `posts/${postId}/likes`);

            //  Fetch all likes documents first
            const likesSnapshot = await getDocs(likesCollectionRef);

            //  Delete each like document
            const deleteLikesPromises = likesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
            await Promise.all(deleteLikesPromises);
            console.log(`Deleted ${likesSnapshot.size} likes from post ${postId}`);

            //  Start a batch operation
            const batch = writeBatch(this.db);

            batch.delete(postRef); // Delete the post from the main "posts" collection
            batch.delete(userPostRef); // Delete the reference from the user's "myPosts" subcollection

            // Commit the batch operation
            await batch.commit();

            console.log(`Post ${postId} deleted successfully!`);
            return { success: true };
        } catch (error) {
            console.error("Error deleting post:", error);
            return { success: false, error: error.message };
        }
    }

    async getSavedPosts(userId, lastVisible = null, pageSize = 10) {
        try {
            const savedPostsCollection = collection(this.db, `users/${userId}/savedPosts`);

            let postsQuery = query(savedPostsCollection, orderBy("savedAt", "desc"), limit(pageSize));

            if (lastVisible) {
                postsQuery = query(postsQuery, startAfter(lastVisible));
            }

            const querySnapshot = await getDocs(postsQuery);
            if (querySnapshot.empty) return { posts: [], lastVisible: null };

            // Extract post references
            const savedPostDocs = querySnapshot.docs;
            const postRefs = savedPostDocs.map((doc) => ({ id: doc.id, postRef: doc.data().postRef }));

            // Fetch actual post data from `posts` collection using references
            const postFetchPromises = postRefs.map(({ postRef }) => getDoc(postRef));
            const postSnapshots = await Promise.all(postFetchPromises);

            const validPosts = [];
            const invalidPostIds = [];
            const userFetchPromises = [];

            postSnapshots.forEach((snap, index) => {
                if (snap.exists()) {
                    const postData = snap.data();
                    const createdByRef = postData.createdBy; // User reference

                    // Store post data and fetch user data in parallel
                    validPosts.push({
                        id: snap.id,
                        ...postData,
                        savedAt: savedPostDocs[index].data().savedAt,
                        createdBy: null, // Placeholder for user data
                    });

                    // Fetch createdBy user data
                    if (createdByRef) {
                        userFetchPromises.push(getDoc(createdByRef));
                    } else {
                        userFetchPromises.push(null);
                    }
                } else {
                    // If post doesn't exist, mark it for deletion
                    invalidPostIds.push(postRefs[index].id);
                }
            });

            // Fetch all user data in parallel
            const userSnapshots = await Promise.all(userFetchPromises);

            // Inject user data into posts
            userSnapshots.forEach((userSnap, index) => {
                if (userSnap && userSnap.exists()) {
                    validPosts[index].createdBy = {
                        id: userSnap.id,
                        ...userSnap.data(),
                    };
                } else {
                    validPosts[index].createdBy = { id: null, name: "Unknown User" }; // Handle missing users
                }
            });

            // Remove invalid saved posts
            if (invalidPostIds.length > 0) {
                console.warn("Removing invalid saved posts:", invalidPostIds);
                const batch = writeBatch(this.db);
                invalidPostIds.forEach((postId) => {
                    const savedPostRef = doc(this.db, `users/${userId}/savedPosts`, postId);
                    batch.delete(savedPostRef);
                });
                await batch.commit();
            }

            const newLastVisible = savedPostDocs[savedPostDocs.length - 1];

            return { posts: validPosts, lastVisible: newLastVisible };
        } catch (error) {
            console.error("Error fetching saved posts:", error);
            return { posts: [], lastVisible: null };
        }
    }

    async getSavedPostRefs(userId) {
        try {
            // Fetch references from the "savedPosts" subcollection in the user's document
            const savedPostsCollection = collection(this.db, `users/${userId}/savedPosts`);
            const savedPostsSnapshot = await getDocs(savedPostsCollection);

            // Extract references
            const savedPostRefs = savedPostsSnapshot.docs.map((doc) => doc.data().postRef);

            return savedPostRefs; // Return an array of references
        } catch (error) {
            console.error("Error fetching saved post references:", error);
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
                await setDoc(likeDocRef, { likedStatus, createdAt: serverTimestamp() });
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

    async getLikedUsers(postId, lastVisible = null, pageSize = 10) {
        try {
            const likesCollection = collection(this.db, `posts/${postId}/likes`);

            let q = query(
                likesCollection,
                where("likedStatus", "==", "liked"),
                orderBy("createdAt", "desc"),
                limit(pageSize)
            );

            if (lastVisible) {
                q = query(q, startAfter(lastVisible));
            }

            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) return { likedUsers: [], lastVisible: null };

            // Fetch user data in parallel
            const userFetchPromises = querySnapshot.docs.map(async (likeDoc) => {
                const userId = likeDoc.id; //]doc ID is user ID
                const userRef = doc(this.db, "users", userId);
                const userSnap = await getDoc(userRef);

                return userSnap.exists()
                    ? { id: userId, name: userSnap.data().name || "Unknown" }
                    : { id: userId, name: "Unknown" }; // Handle missing user
            });

            const likedUsers = await Promise.all(userFetchPromises);
            const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

            return { likedUsers, lastVisible: newLastVisible };
        } catch (error) {
            console.error("Error fetching liked users:", error);
            return { likedUsers: [], lastVisible: null };
        }
    }

    async sendConnectionRequest(senderData, receiverData) {
        try {
            const senderId = senderData.uid;
            const receiverId = receiverData.uid;

            const senderRequestsRef = collection(this.db, "users", senderId, "connectionRequests");
            const receiverRequestsRef = collection(this.db, "users", receiverId, "connectionRequests");
            const receiverNotificationsRef = collection(this.db, "users", receiverId, "notifications");

            console.log(`Sending request from ${senderId} to ${receiverId}`);

            // Check if request already exists
            const existingRequests = await getDocs(senderRequestsRef);
            const alreadySent = existingRequests.docs.some(
                (doc) => doc.data().other === receiverId
            );

            if (alreadySent) {
                console.warn("Connection request already sent.");
                return;
            }

            // Add request to sender's subcollection
            await setDoc(doc(senderRequestsRef, receiverId), {
                type: "sent",
                other: receiverId,
                timestamp: serverTimestamp()
            });

            // Add request to receiver's subcollection
            await setDoc(doc(receiverRequestsRef, senderId), {
                type: "received",
                other: senderId,
                timestamp: serverTimestamp()
            });

            // Add notification to receiver's subcollection
            await setDoc(doc(receiverNotificationsRef, senderId), {
                type: "connectionRequest",
                status: "unread",
                other: senderId,
                content: `${senderData.name} wants to Connect!`,
                timestamp: serverTimestamp()
            });

            console.log("Connection request sent successfully!");
        } catch (error) {
            console.error("Error sending connection request:", error);
            throw error;
        }
    }

    async deleteNotification(notificationId, userId) {
        try {
            const notificationRef = doc(this.db, "users", userId, "notifications", notificationId);

            await deleteDoc(notificationRef);

            console.log("Notification deleted successfully!");
        } catch (error) {
            console.error("Error deleting notification:", error);
            throw error;
        }
    }

    async checkUnreadNotification(userId) {
        try {
            const notificationsCollection = collection(this.db, `users/${userId}/notifications`);
            const notificationsQuery = query(notificationsCollection, limit(1)); // Fetch only one unread notification
            const querySnapshot = await getDocs(notificationsQuery);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Error checking unread notifications:", error);
            return false;
        }
    }

    async getNotificationCount(userId) {
        try {
            const notificationsCollection = collection(this.db, `users/${userId}/notifications`);
            const notificationsQuery = query(notificationsCollection);
            const querySnapshot = await getDocs(notificationsQuery);
            return querySnapshot.size;
        } catch (error) {
            console.error("Error fetching notification count:", error);
            return 0;
        }
    }

    async getNotifications(userId) {
        try {
            const notificationsCollection = collection(this.db, `users/${userId}/notifications`);
            const notificationsQuery = query(notificationsCollection, orderBy("timestamp", "desc")); // Order by latest
            const querySnapshot = await getDocs(notificationsQuery);

            const notifications = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return notifications;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }
    }

    async handleConnectionRequest(status, senderId, receiverId) {
        try {
            const senderRef = doc(this.db, "users", senderId);
            const receiverRef = doc(this.db, "users", receiverId);

            const senderRequestRef = doc(this.db, "users", senderId, "connectionRequests", receiverId);
            const receiverRequestRef = doc(this.db, "users", receiverId, "connectionRequests", senderId);

            const senderConnectionRef = doc(this.db, "users", senderId, "connections", receiverId);
            const receiverConnectionRef = doc(this.db, "users", receiverId, "connections", senderId);

            const batch = writeBatch(this.db);

            // Remove connection request from sender's and receiver's connectionRequests subcollection
            batch.delete(senderRequestRef);
            batch.delete(receiverRequestRef);

            // If status is "accepted", add to both users' connections subcollection
            if (status === "accepted") {
                batch.set(senderConnectionRef, { other: receiverId, createdAt: serverTimestamp() });
                batch.set(receiverConnectionRef, { other: senderId, createdAt: serverTimestamp() });
            }

            // batch update
            await batch.commit();

            console.log("Connection request handled successfully!");
        } catch (error) {
            console.error("Error handling connection request:", error);
            throw error;
        }
    }

    async getConnectionStatus(userId, otherUserId) {
        try {
            if (!userId || !otherUserId || userId === otherUserId) return "error";
            // Check if otherUserId exists in the connections subcollection of userId
            const connectionRef = doc(this.db, "users", userId, "connections", otherUserId);
            const connectionSnap = await getDoc(connectionRef);

            if (connectionSnap.exists()) {
                return "connected";
            }

            // Check if otherUserId exists in the connectionRequests subcollection of userId
            const requestRef = doc(this.db, "users", userId, "connectionRequests", otherUserId);
            const requestSnap = await getDoc(requestRef);

            if (requestSnap.exists()) {
                const requestData = requestSnap.data();
                return requestData.type; // 'sent' or 'received'
            }

            // If neither exists
            return "Connect";
        } catch (error) {
            console.error("Error checking connection status:", error);
            return "error";
        }
    }

    async getConnections(userId, lastVisible = null, pageSize = 10) {
        try {
            const connectionsRef = collection(this.db, "users", userId, "connections");

            let connectionsQuery = query(connectionsRef, orderBy("createdAt", "desc"), limit(pageSize));

            if (lastVisible) {
                connectionsQuery = query(connectionsRef, orderBy("createdAt", "desc"), startAfter(lastVisible), limit(pageSize));
            }

            const connectionsSnap = await getDocs(connectionsQuery);
            if (connectionsSnap.empty) return { connections: [], lastVisible: null };

            // Get connection IDs
            const connectionDocs = connectionsSnap.docs;
            const connectionIds = connectionDocs.map(doc => doc.id);

            // Fetch user data for each connection
            const userFetchPromises = connectionIds.map(async (connectionId) => {
                const userRef = doc(this.db, "users", connectionId);
                const userSnap = await getDoc(userRef);
                return userSnap.exists() ? { id: connectionId, ...userSnap.data() } : null;
            });

            const connections = (await Promise.all(userFetchPromises)).filter(user => user !== null);

            // Update pagination state
            const newLastVisible = connectionDocs[connectionDocs.length - 1];

            return { connections, lastVisible: newLastVisible };
        } catch (error) {
            console.error("Error fetching connections:", error);
            return { connections: [], lastVisible: null };
        }
    }

    async getUserProfiles(userIds) {
        try {
            if (!userIds || userIds.length === 0) return [];

            const usersCollection = collection(this.db, "users");

            // Firestore limits `where("in")` to 10 items, so we batch if necessary
            const batchSize = 10;
            const batches = [];
            for (let i = 0; i < userIds.length; i += batchSize) {
                const batchIds = userIds.slice(i, i + batchSize);
                const q = query(usersCollection, where("__name__", "in", batchIds));
                batches.push(getDocs(q));
            }

            // Execute all queries in parallel
            const results = await Promise.all(batches);

            // Extract user profiles
            const userProfiles = [];
            results.forEach((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    userProfiles.push({ id: doc.id, ...doc.data() });
                });
            });

            return userProfiles;
        } catch (error) {
            console.error("Error fetching user profiles:", error);
            return [];
        }
    }

    async getConnectionRequests(userId, lastVisible = null, pageSize = 10) {
        try {
            const requestsRef = collection(this.db, "users", userId, "connectionRequests");

            let requestsQuery = query(requestsRef, orderBy("timestamp", "desc"), limit(pageSize));

            if (lastVisible) {
                requestsQuery = query(requestsRef, orderBy("timestamp", "desc"), startAfter(lastVisible), limit(pageSize));
            }

            const requestsSnap = await getDocs(requestsQuery);
            if (requestsSnap.empty) return { connectionRequests: [], lastVisible: null };

            // Get request data
            const requestDocs = requestsSnap.docs;
            const requestData = requestDocs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Fetch user data for each request sender
            const userFetchPromises = requestData.map(async (request) => {
                const userRef = doc(this.db, "users", request.id);
                const userSnap = await getDoc(userRef);
                return userSnap.exists()
                    ? { ...request, senderData: { id: request.id, ...userSnap.data() } }
                    : null;
            });

            const connectionRequests = (await Promise.all(userFetchPromises)).filter(req => req !== null);

            // Update pagination state
            const newLastVisible = requestDocs[requestDocs.length - 1];

            return { connectionRequests, lastVisible: newLastVisible };
        } catch (error) {
            console.error("Error fetching connection requests:", error);
            return { connectionRequests: [], lastVisible: null };
        }
    }

    async deleteConnection(userId, connectionId) {
        try {
            console.log(`Deleting connection between ${userId} and ${connectionId}`);

            // Reference to the connection documents in each user's subcollection
            const userConnectionRef = doc(this.db, "users", userId, "connections", connectionId);
            const otherUserConnectionRef = doc(this.db, "users", connectionId, "connections", userId);

            // Delete the connection documents from both users' subcollections
            await deleteDoc(userConnectionRef);
            await deleteDoc(otherUserConnectionRef);

            console.log("Connection deleted successfully!");
        } catch (error) {
            console.error("Error deleting connection:", error);
            throw error;
        }
    }

    async createGroupChat(chatId, members, type = "private", name) {
        try {
            const chatRef = doc(this.db, "chats", chatId);

            await setDoc(chatRef, {
                members, // Store member IDs as an array of strings
                type,
                createdAt: serverTimestamp(),
                name,
            });

            // Add group chat ID to each member's "chats" subcollection
            for (const memberId of members) {
                const userChatRef = doc(this.db, "users", memberId, "chats", chatId);
                await setDoc(userChatRef, {
                    chatId,
                    type,
                    name,
                    createdAt: serverTimestamp(),
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

            // Add user to the group chat members array in the chat document
            await updateDoc(chatRef, {
                members: arrayUnion(memberId),
            });

            // Add chat ID as a document in the user's "chats" subcollection
            const userChatRef = doc(this.db, "users", memberId, "chats", chatId);
            await setDoc(userChatRef, {
                chatId,
                type: chatData.type,
                name: chatData.name,
                createdAt: chatData.createdAt,
            });

            console.log(`Member ${memberId} added to group chat ${chatId} successfully!`);
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

    async getAllChats(userId) {
        try {
            if (!userId) return [];

            //  Fetch user's chat IDs from the `chats` subcollection inside the `users` document
            const userChatsCollection = collection(this.db, `users/${userId}/chats`);
            const userChatsSnapshot = await getDocs(userChatsCollection);

            // Extract chat IDs
            const chatIds = userChatsSnapshot.docs.map((doc) => doc.id);
            if (chatIds.length === 0) return [];

            //  Fetch chat details for those chat IDs
            const chatRefs = chatIds.map((chatId) => doc(this.db, "chats", chatId));
            const chatSnapshots = await getDocs(query(collection(this.db, "chats"), where("__name__", "in", chatIds)));

            //  Extract chat data
            const chats = chatSnapshots.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return chats;
        } catch (error) {
            console.error("Error fetching chats:", error);
            return [];
        }
    }

    // check if chat is present in chats subcollection of user
    async checkChatExists(chatId, userId) {
        try {
            const chatRef = doc(this.db, `users/${userId}/chats/${chatId}`);
            const chatSnap = await getDoc(chatRef);

            return chatSnap.exists(); // Returns true if the chat exists, otherwise false
        } catch (error) {
            console.error("Error checking chat existence:", error);
            return false;
        }
    }

    async fetchRecentMessages(chatId, lastMessageTimestamp = null) {
        try {
            const messagesCollection = collection(dbServices.db, `chats/${chatId}/messages`);
            let queryConstraints = [
                orderBy("timestamp", "desc"), // Get newest messages first
                limit(10) // Fetch the latest 10 messages
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
            // console.log("Messages fetched successfully:", messages);
            return messages.reverse();
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw error;
        }
    }

    async deleteMessage(chatId, message) {
        try {
            // delete shared files if any
            const messageId = message.id;
            if (message.fileData) {
                // console.log("Deleting file:", message.fileData);
                // await appwriteStorage.deleteFile(message.fileData.fileId);
                // console.log("File deleted successfully!");
                const mediaRef = doc(this.db, `chats/${chatId}/media`, messageId);
                await deleteDoc(mediaRef);
            }
            const messageRef = doc(this.db, `chats/${chatId}/messages`, messageId);
            await deleteDoc(messageRef);
        } catch (error) {
            console.error("Error deleting message:", error);
            throw error;
        }
    }








    // Achievement related services

    async getAllAchievements(lastVisible = null) {
        try {
            let achievementsQuery = query(
                collection(this.db, "achievements"),
                orderBy("createdAt", "desc"),
                limit(10)
            );

            if (lastVisible) {
                achievementsQuery = query(achievementsQuery, startAfter(lastVisible));
            }

            const querySnapshot = await getDocs(achievementsQuery);

            const achievements = await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    let createdBy = null;

                    if (data.createdBy) {
                        try {
                            const userDoc = await this.getDocument("users", data.createdBy);
                            if (userDoc) {
                                createdBy = {
                                    id: data.createdBy,
                                    ...userDoc,
                                };
                            }
                        } catch (err) {
                            console.error(`Failed to fetch user with ID: ${data.createdBy}`, err);
                        }
                    }

                    return {
                        id: doc.id,
                        ...data,
                        createdBy,
                    };
                })
            );

            const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

            return { achievements, lastVisible: newLastVisible };
        } catch (error) {
            console.error("Error fetching achievements:", error);
            throw error;
        }
    }



    async createAchievement(newAchievement) {
        try {
            newAchievement.createdAt = serverTimestamp();
            const achievementRef = await addDoc(collection(this.db, "achievements"), newAchievement);

            //Fetch the created achievement and return it
            const createdAchievement = await getDoc(achievementRef);
            return { id: achievementRef.id, ...createdAchievement.data() };

        } catch (error) {
            console.error("Error creating achievement:", error);
            throw error;
        }
    }

    // delete achievement
    async deleteAchievement(achievementId) {
        try {
            const achievementRef = doc(this.db, "achievements", achievementId);
            await deleteDoc(achievementRef);
            console.log(`Achievement with ID ${achievementId} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting achievement:", error);
            throw error;
        }
    }

    async getAllOpportunities(lastVisible = null) {
        try {
            let opportunitiesQuery = query(
                collection(this.db, "opportunities"),
                orderBy("createdAt", "desc"),
                limit(10)
            );

            if (lastVisible) {
                opportunitiesQuery = query(opportunitiesQuery, startAfter(lastVisible));
            }

            const querySnapshot = await getDocs(opportunitiesQuery);

            const opportunities = await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    let createdBy = null;

                    if (data.createdBy) {
                        try {
                            const userDoc = await this.getDocument("users", data.createdBy);
                            if (userDoc) {
                                createdBy = {
                                    id: data.createdBy,
                                    ...userDoc,
                                };
                            }
                        } catch (err) {
                            console.error(`Failed to fetch user with ID: ${data.createdBy}`, err);
                        }
                    }

                    return {
                        id: doc.id,
                        ...data,
                        createdBy,
                    };
                })
            );

            const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

            return { opportunities, lastVisible: newLastVisible };
        } catch (error) {
            console.error("Error fetching opportunities:", error);
            throw error;
        }
    }

    // get one opportunity by id
    async getOpportunityById(opportunityId) {
        try {
            const opportunityRef = doc(this.db, "opportunities", opportunityId);
            const opportunitySnap = await getDoc(opportunityRef);

            if (opportunitySnap.exists()) {
                const data = opportunitySnap.data();
                let createdBy = null;

                if (data.createdBy) {
                    try {
                        const userDoc = await this.getDocument("users", data.createdBy);
                        if (userDoc) {
                            createdBy = {
                                id: data.createdBy,
                                ...userDoc,
                            };
                        }
                    } catch (err) {
                        console.error(`Failed to fetch user with ID: ${data.createdBy}`, err);
                    }
                }
                return {
                    id: opportunitySnap.id,
                    ...data,
                    createdBy,
                };
            } else {
                console.error("No such opportunity exists!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching opportunity:", error);
            throw error;
        }
    }

    // get post by id
    async getPostById(postId) {
        try {
            const postRef = doc(this.db, "posts", postId);
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                const data = postSnap.data();
                let createdBy = null;

                if (data.createdBy) {
                    try {
                        const userDoc = await getDoc(data.createdBy); // Fetch document

                        console.log("userDoc", userDoc); // Debugging

                        if (userDoc.exists()) {
                            createdBy = {
                                id: userDoc.id,
                                ...userDoc.data(),
                            };
                        }
                    } catch (err) {
                        console.error(`Failed to fetch user with ID: ${data.createdBy.id}`, err);
                    }
                }

                return {
                    id: postSnap.id,
                    ...data,
                    createdBy,
                };
            } else {
                console.error("No such post exists!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching post:", error);
            throw error;
        }
    }

    // get achievement by id

    async getAchievementById(achievementId) {
        try {
            const achievementRef = doc(this.db, "achievements", achievementId);
            const achievementSnap = await getDoc(achievementRef);

            if (achievementSnap.exists()) {
                const data = achievementSnap.data();
                let createdBy = null;

                if (data.createdBy) {
                    try {
                        const userDoc = await this.getDocument("users", data.createdBy);
                        if (userDoc) {
                            createdBy = {
                                id: data.createdBy,
                                ...userDoc,
                            };
                        }
                    } catch (err) {
                        console.error(`Failed to fetch user with ID: ${data.createdBy}`, err);
                    }
                }

                return {
                    id: achievementSnap.id,
                    ...data,
                    createdBy,
                };
            } else {
                console.error("No such achievement exists!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching achievement:", error);
            throw error;
        }
    }


    // Create a new opportunity
    async createOpportunity(newOpportunity) {
        try {
            newOpportunity.createdAt = serverTimestamp();
            const opportunityRef = await addDoc(collection(this.db, "opportunities"), newOpportunity);

            const createdOpportunity = await getDoc(opportunityRef);
            return { id: createdOpportunity.id, ...createdOpportunity.data() };

        } catch (error) {
            console.error("Error creating opportunity:", error);
            throw error;
        }
    }


    // Delete an opportunity
    async deleteOpportunity(opportunityId) {
        try {
            const opportunityRef = doc(this.db, "opportunities", opportunityId);
            await deleteDoc(opportunityRef);
            console.log(`Opportunity with ID ${opportunityId} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting opportunity:", error);
            throw error;
        }
    }

    // Example helper method to get document (if needed)
    async getDocument(collectionName, docId) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.error(`No document found with ID ${docId}`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching document from ${collectionName}`, error);
            throw error;
        }
    }

    async fetchPendingUsers(lastVisible = null) {
        try {
            let usersQuery = query(
                collection(this.db, "pendingUsers"),
                where("emailVerified", "==", true),
                where("userVerificationStatus", "==", "pending"),
                orderBy("createdAt", "desc"),
                limit(10)
            );

            if (lastVisible) {
                usersQuery = query(usersQuery, startAfter(lastVisible));
            }

            const querySnapshot = await getDocs(usersQuery);

            if (querySnapshot.empty) {
                return { users: [], lastVisible: null };
            }

            const users = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const newLastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
            // console.log(users)

            return { users, lastVisible: newLastVisible };
        } catch (error) {
            console.error("Error fetching pending users:", error);
            throw error;
        }
    }

    async acceptPendingUser(userId) {
        try {
            const pendingUserRef = doc(dbServices.db, "pendingUsers", userId);
            const userRef = doc(dbServices.db, "users", userId);

            // Fetch pending user data
            const pendingUserSnap = await getDoc(pendingUserRef);

            if (!pendingUserSnap.exists()) {
                throw new Error("User not found in pending users.");
            }

            const userData = pendingUserSnap.data();

            // Remove remark field before moving
            delete userData.verificationRemark;

            // Move user to 'users' collection
            await setDoc(userRef, {
                ...userData,
                userVerificationStatus: "verified",
                createdAt: serverTimestamp(),
            });

            // Delete from pendingUsers
            await deleteDoc(pendingUserRef);

            console.log(`User ${userId} accepted and moved to users collection.`);
        } catch (error) {
            console.error("Error accepting user:", error);
            throw error;
        }
    }


    // reject pending user
    async rejectPendingUser(userId, remark = "No reason provided") {
        try {
            const userRef = doc(dbServices.db, "pendingUsers", userId);

            await updateDoc(userRef, {
                userVerificationStatus: "rejected",
                verificationRemark: remark.trim() || "No reason provided",
            });

            console.log(`User with ID ${userId} rejected successfully.`);
        } catch (error) {
            console.error("Error rejecting user:", error);
            throw error;
        }
    }

    async search(queryText, lastVisible = null, pageSize = 10) {
        console.log("Searching for:", queryText);
        try {
            // queryText = queryText.toLowerCase();

            // Collections
            const usersCollection = collection(this.db, "users");
            const postsCollection = collection(this.db, "posts");
            const opportunitiesCollection = collection(this.db, "opportunities");
            const achievementsCollection = collection(this.db, "achievements");
            const communitiesCollection = collection(this.db, "communities");

            // Base queries with search filter
            let usersQuery = query(
                usersCollection,
                orderBy("name"),
                startAt(queryText),
                endAt(queryText + "\uf8ff"), // Matches names starting with queryText
                limit(pageSize)
            );

            let postsQuery = query(
                postsCollection,
                orderBy("content"),
                startAt(queryText),
                endAt(queryText + "\uf8ff"),
                limit(pageSize)
            );

            let opportunitiesQuery = query(
                opportunitiesCollection,
                orderBy("title"),
                startAt(queryText),
                endAt(queryText + "\uf8ff"),
                limit(pageSize)
            );

            let achievementsQuery = query(
                achievementsCollection,
                orderBy("title"),
                startAt(queryText),
                endAt(queryText + "\uf8ff"),
                limit(pageSize)
            );

            let communitiesQuery = query(
                communitiesCollection,
                orderBy("name"),
                startAt(queryText),
                endAt(queryText + "\uf8ff"),
                limit(pageSize)
            );

            // Pagination
            if (lastVisible) {
                usersQuery = query(usersQuery, startAfter(lastVisible));
                postsQuery = query(postsQuery, startAfter(lastVisible));
                opportunitiesQuery = query(opportunitiesQuery, startAfter(lastVisible));
                achievementsQuery = query(achievementsQuery, startAfter(lastVisible));
                communitiesQuery = query(communitiesQuery, startAfter(lastVisible));
            }

            // Fetch data
            const [usersSnap, postsSnap, opportunitiesSnap, achievementsSnap, communitiesSnap] = await Promise.all([
                getDocs(usersQuery),
                getDocs(postsQuery),
                getDocs(opportunitiesQuery),
                getDocs(achievementsQuery),
                getDocs(communitiesQuery),
            ]);

            // Process data
            const users = usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const posts = postsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const opportunities = opportunitiesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const achievements = achievementsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const communities = communitiesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            return {
                users,
                posts,
                opportunities,
                achievements,
                communities,
                lastVisible: usersSnap.docs[usersSnap.docs.length - 1] || null,
            };
        } catch (error) {
            console.error("Error searching:", error);
            return { users: [], posts: [], opportunities: [], achievements: [], communities: [], lastVisible: null };
        }
    }


}

const dbServices = new DB();
export default dbServices;