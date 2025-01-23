import React, { useState } from 'react';
import appwriteStorage from './appwrite/appwriteStorage';

function FileUpload() {
    const [file, setFile] = useState(null); // State to hold the selected file
    const [uploading, setUploading] = useState(false); // State to handle the uploading state
    const [uploadSuccess, setUploadSuccess] = useState(null); // State to handle upload success or failure
    const [fileid, setFileid] = useState(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
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
        
        if (result) {
            setUploadSuccess("File uploaded successfully!");
            setFileid(result.$id);
        } else {
            setUploadSuccess("Failed to upload the file.");
        }

        setUploading(false); // Reset uploading state
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Upload a File</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                        className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>
            </form>

            {uploadSuccess && (
                <p className="mt-4 text-center text-lg text-green-500">{uploadSuccess}</p>
            )}

            {fileid && (
                <div className="mt-4 text-center">
                    <img
                        src={appwriteStorage.getFilePreview(fileid)}
                        alt="Uploaded file preview"
                        className="max-w-full max-h-64 mx-auto rounded-md"
                    />
                    <button
                        onClick={() => {
                            appwriteStorage.deleteFile(fileid);
                            setFileid(null);
                        }}
                        className="mt-2 text-red-500 hover:text-red-600"
                    >
                        Delete File
                    </button>
                </div>
            )}
        </div>
    );
}

export default FileUpload;
