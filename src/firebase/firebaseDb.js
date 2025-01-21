import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, collection } from "firebase/firestore";
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
            const docRef = await addDoc(colRef, data);
            console.log("Document written with ID: ", docRef.id);
            return docRef.id;
        } catch (error) {
            console.error("Firebase DB services : addWithAutoId ::", error);
            throw error;
        }
    }

    // get all alumni
    async getAllAlumni() { }

    // get all users
    async getAllUsers() {
        try {
            const usersCollection = collection(this.db, "users");
            const querySnapshot = await getDocs(usersCollection);
            const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            console.log("Users fetched successfully:", users);
            return users; 
        } catch (error) {
            console.error("Error fetching users:", error.message);
            throw error; 
        }
    }
}

const dbServices = new DB();
export default dbServices;
