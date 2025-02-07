import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dbServices from "../firebase/firebaseDb";

function EditProfile(profileId) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!userData) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const form = e.target;
    const formData = new FormData(form);

    const updatedProfile = {};

    for (let [key, value] of formData.entries()) {
      const trimmedValue = value.trim();
      if (trimmedValue !== (userData?.[key] || "").trim()) {
        updatedProfile[key] = trimmedValue;
      }
    }
    await dbServices.updateDocument("users", userData.uid, updatedProfile);
    navigate(`/profile/${userData.uid}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-8">
      <form className="max-w-3xl mx-auto space-y-6" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4">
          Edit Profile
        </h1>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={userData?.name || ""}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  hover:scale-105 transition-all"
            placeholder="Your Name"
          />
        </div>

        {/* Education & Position */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Education
            </label>
            <input
              type="text"
              name="education"
              defaultValue={userData?.education || ""}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  hover:scale-105 transition-all"
              placeholder="Degree & University"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Current Position
            </label>
            <input
              type="text"
              name="position"
              defaultValue={userData?.position || ""}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  hover:scale-105 transition-all"
              placeholder="Job title & Company"
            />
          </div>
        </div>

        {/* Location & Batch */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Location
            </label>
            <input
              type="text"
              name="location"
              defaultValue={userData?.location || ""}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  hover:scale-105 transition-all"
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Batch
            </label>
            <input
              type="text"
              name="batch"
              defaultValue={userData?.batch || ""}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:scale-105 transition-all"
              placeholder="Graduation year"
            />
          </div>
        </div>

        {/* About Section */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            About
          </label>
          <textarea
            name="about"
            defaultValue={userData?.about || ""}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 hover:scale-105 transition-all"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Social Links</h3>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <input
              type="url"
              name="linkedin"
              defaultValue={userData?.linkedin || ""}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:scale-105 transition-all"
              placeholder="LinkedIn URL"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
              </svg>
            </div>
            <input
              type="email"
              name="secondaryEmail"
              defaultValue={userData?.secondaryEmail || ""}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:scale-105 transition-all"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </div>
            <input
              type="url"
              name="twitter"
              defaultValue={userData?.socials?.twitter || ""}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:scale-105 transition-all"
              placeholder="Twitter URL"
            />
          </div>
        </div>

        {/* Emails Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">
            Email Addresses
          </h3>

          {/* Primary Email (Read-Only) */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Primary Email
            </label>
            <input
              type="email"
              name="primaryEmail"
              value={userData?.email || ""}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              readOnly
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-8 border-t border-gray-700">
          <button
            type="button"
            className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 hover:scale-105 transition-all"
            onClick={() => navigate(`/profile/${userData?.uid}`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-800 hover:scale-105 rounded-lg transition-all"
          >
            Save & Exit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
