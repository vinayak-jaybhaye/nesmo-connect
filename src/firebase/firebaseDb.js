import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, collection, addDoc, query, where, orderBy } from "firebase/firestore";
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
                return docSnap.data();
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
}

const dbServices = new DB();
export default dbServices;
