import conf from './conf';
import { Client, ID, Storage } from 'appwrite'

export class Service {
    client = new Client();

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.bucket = new Storage(this.client);
    }


    // file upload service

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId, ID.unique(), file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadfile:: error", error)
            return false
        }
    }


    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId)
            console.log("Appwrite service :: deletefile:: success")
            return true
        } catch (error) {
            console.log("Appwrite service :: deletefile:: error", error)
            return false
        }
    }


    getFilePreview(fileId) {
        return this.bucket.getFilePreview(conf.appwriteBucketId, fileId)
    }

}


const appwriteStorage = new Service()
export default appwriteStorage;