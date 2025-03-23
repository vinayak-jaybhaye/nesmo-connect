import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
        <span className="text-white font-medium">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;
