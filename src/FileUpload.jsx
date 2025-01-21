import React, { useState } from 'react';
import appwriteStorage from './appwrite/appwriteStorage';
function FileUpload() {
    const [file, setFile] = useState(null); // State to hold the selected file
    const [uploading, setUploading] = useState(false); // State to handle the uploading state
    const [uploadSuccess, setUploadSuccess] = useState(null); // State to handle upload success or failure
    const [fileid, setFileid] = useState(null)

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        // console.log(selectedFile)
        setFile(selectedFile);
    };

    // Handle form submission to upload file
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        setUploading(true);
        setUploadSuccess(null); // Reset success message before starting upload

        // Call the upload file method from your service
        const result = await appwriteStorage.uploadFile(file);
        console.log(result)
        

        if (result) {
            setUploadSuccess("File uploaded successfully!");
            setFileid(result.$id)
        } else {
            setUploadSuccess("Failed to upload the file.");
        }

        setUploading(false); // Reset uploading state
    };

    return (
        <div>
            <h2>Upload a File</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*,application/pdf" // Example of allowed file types
                />
                <button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>
            </form>

            <img src= {appwriteStorage.getFilePreview(fileid)} alt="" />
            <button onClick={() => {
                console.log(fileid)
                appwriteStorage.deleteFile(fileid)
            }}>delete</button>

            {uploadSuccess && <p>{uploadSuccess}</p>} {/* Show upload success or failure */}
        </div>
    );
}

export default FileUpload;
