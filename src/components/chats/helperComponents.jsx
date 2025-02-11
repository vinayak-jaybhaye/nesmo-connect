import {
  VideoCameraIcon,
  MusicalNoteIcon,
  DocumentTextIcon,
  ArchiveBoxIcon,
  DocumentIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

const DeleteIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const XMarkIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const PhotoIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);

// Helper components
const MenuIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
    />
  </svg>
);

const AttachmentIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-gray-400 group-hover:text-blue-400"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5L12 15m0 0l-4.5-4.5M12 15V3"
    />
  </svg>
);

const FileTypeIcon = ({ mimeType, className }) => {
  const type = mimeType.split("/")[0];
  const extension = mimeType.split("/")[1];

  switch (type) {
    case "image":
      return <PhotoIcon className={className} />;
    case "video":
      return <VideoCameraIcon className={className} />;
    case "audio":
      return <MusicalNoteIcon className={className} />;
    case "application":
      if (extension.includes("pdf"))
        return <DocumentTextIcon className={className} />;
      if (extension.includes("zip") || extension.includes("compressed"))
        return <ArchiveBoxIcon className={className} />;
      return <DocumentIcon className={className} />;
    default:
      return <DocumentArrowDownIcon className={className} />;
  }
};

// Helper function for message bubble classes
const getMessageBubbleClasses = (isCurrentUser) =>
  `max-w-[85%] p-3 rounded-lg relative ${
    isCurrentUser ? "bg-blue-900 ml-8" : "bg-gray-800 mr-8"
  } transition-colors duration-200`;

const RenderFile = (fileUrl, fileType) => {
  if (!fileType) return null;

  // Image handler
  if (fileType.startsWith("image/")) {
    return (
      <img
        src={fileUrl}
        alt="File preview"
        className="w-32 h-32 object-cover rounded-lg cursor-pointer ring-1 ring-gray-700/50 hover:ring-gray-600 transition-all"
        onClick={() => window.open(fileUrl, "_blank")}
      />
    );
  }

  // Video handler
  if (fileType.startsWith("video/")) {
    return (
      <video controls className="w-64 h-36 rounded-lg">
        <source src={fileUrl} type={fileType} />
        Your browser does not support the video tag.
      </video>
    );
  }

  // Audio handler
  if (fileType.startsWith("audio/")) {
    return (
      <audio controls className="w-48">
        <source src={fileUrl} type={fileType} />
        Your browser does not support the audio element.
      </audio>
    );
  }

  // PDF & Openable Docs handler
  if (
    [
      "application/pdf",
      "text/plain",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(fileType)
  ) {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline flex items-center gap-2"
      >
        <img src="/file.svg" className="h-6 w-6" /> View{" "}
        {fileType.split("/")[1].toUpperCase()}
      </a>
    );
  }

  // Generic file handler (downloadable)
  return (
    <a
      href={fileUrl}
      download
      className="text-blue-400 underline flex items-center gap-2"
    >
      <img src="/file.svg" className="h-6 w-6" /> download file
    </a>
  );
};

export default RenderFile;

export {
  DeleteIcon,
  MenuIcon,
  getMessageBubbleClasses,
  AttachmentIcon,
  FileTypeIcon,
};
