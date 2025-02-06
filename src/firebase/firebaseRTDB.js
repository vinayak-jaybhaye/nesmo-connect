import {getDatabase} from 'firebase/database';
import app from './firebaseConfig.js';


class RTDB{
    rtdb;
    constructor(){
        this.rtdb = getDatabase(app);
    }

    // add document to collection
    async addDocument(collectionName, docId, data){
        try {
            await setDoc(doc(this.db, collectionName, docId), data);
            console.log("Document successfully written!");
        } catch (error) {
            console.error("Firebase DB services : addDocument :: ", error);
            throw error;
        }
    }
}

const rtdb = new RTDB();
export default rtdb;