import React from "react";

function PostCard({ post }) {
    const { content, owner, createdAt, imageUrl } = post;

    // Format createdAt to a readable format
    const formattedDate = createdAt ? new Date(createdAt).toLocaleString() : "Unknown Date";

    return (
        <div className="w-full flex-1 bg-gray-800 p-4 rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl">
            <div className="bg-gray-900 p-4 rounded-lg shadow space-y-4 h-full">
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-600">
                            <img
                                src={post.createdBy?.avatar || 'avatar.png'}
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="font-semibold text-gray-100 text-lg">{owner || "Anonymous"}</div>
                            <div className="text-sm text-gray-400">{formattedDate}</div>
                        </div>
                    </div>
                    <div className="relative">
                        <img src={imageUrl} alt="Post Image" className="rounded-lg object-cover w-full h-64 mb-4" />
                    </div>
                    <p className="text-gray-300 text-base">{content}</p>
                </div>
            </div>
        </div>
    );
}

export default PostCard;
