import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dbServices from "../firebase/firebaseDb";
import { useUserLocation } from "../components/helpers";

function EditProfile() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const { location, error } = useUserLocation();

  useEffect(() => {
    if (!userData) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (location) {
      console.log("User Location:", location);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const personalData = {
      email: formData.get("secondaryEmail"),
      linkedin: formData.get("linkedin"),
      twitter: formData.get("twitter"),
      education: formData.get("education"),
      position: formData.get("position"),
      location: location || userData.personalData.location,
      city: formData.get("city"),
      batch: formData.get("batch"),
      about: formData.get("about"),
    };

    const updatedProfile = {
      name: formData.get("name"),
      personalData,
    };

    await dbServices.updateDocument("users", userData.uid, updatedProfile);
    navigate(`/profile/${userData.uid}`);
  };

  return (
    <div className="h-[90vh] w-full rounded-md overflow-auto bg-gradient-to-br from-gray-900 to-black text-gray-100 p-6 md:p-8">
      <form className="max-w-3xl mx-auto space-y-8" onSubmit={handleSubmit}>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 pb-2 border-b border-gray-700">
          Edit Profile
        </h1>

        {/* Name */}
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-3 text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={userData?.name || ""}
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400
                transition-all duration-200 text-gray-200 placeholder-gray-400"
              placeholder="Your Name"
            />
          </div>

          {/* Education & Position */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium mb-3 text-gray-300">
                Education
              </label>
              <input
                type="text"
                name="education"
                defaultValue={userData?.personalData?.education || ""}
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400
                  transition-all duration-200 text-gray-200 placeholder-gray-400"
                placeholder="Degree & University"
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-3 text-gray-300">
                Current Position
              </label>
              <input
                type="text"
                name="position"
                defaultValue={userData?.personalData?.position || ""}
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400
                  transition-all duration-200 text-gray-200 placeholder-gray-400"
                placeholder="Job title & Company"
              />
            </div>
          </div>

          {/* Location & Batch */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium mb-3 text-gray-300">
                Location
              </label>
              <input
                type="text"
                name="city"
                defaultValue={userData?.personalData?.city || ""}
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400
                  transition-all duration-200 text-gray-200 placeholder-gray-400"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-3 text-gray-300">
                Batch
              </label>
              <input
                type="text"
                name="batch"
                defaultValue={userData?.personalData?.batch || ""}
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400
                  transition-all duration-200 text-gray-200 placeholder-gray-400"
                placeholder="Graduation year"
              />
            </div>
          </div>

          {/* About Section */}
          <div>
            <label className="block text-lg font-medium mb-3 text-gray-300">
              About
            </label>
            <textarea
              name="about"
              defaultValue={userData?.personalData?.about || ""}
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400
                transition-all duration-200 text-gray-200 placeholder-gray-400 h-40"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Social Media Links */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-300 border-b border-gray-700 pb-2">
              Social Links
            </h3>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <input
                type="url"
                name="linkedin"
                defaultValue={userData?.personalData?.linkedin || ""}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400
                  transition-all duration-200 text-gray-200 placeholder-gray-400"
                placeholder="LinkedIn URL"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                </svg>
              </div>
              <input
                type="email"
                name="secondaryEmail"
                defaultValue={userData?.personalData?.email || ""}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400
                  transition-all duration-200 text-gray-200 placeholder-gray-400"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </div>
              <input
                type="url"
                name="twitter"
                defaultValue={userData?.personalData?.twitter || ""}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400
                  transition-all duration-200 text-gray-200 placeholder-gray-400"
                placeholder="Twitter URL"
              />
            </div>
          </div>

          {/* Emails Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-300 border-b border-gray-700 pb-2">
              Email Addresses
            </h3>

            {/* Primary Email (Read-Only) */}
            <div>
              <label className="block text-lg font-medium mb-3 text-gray-300">
                Primary Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="primaryEmail"
                  value={userData?.email || ""}
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl
                    text-gray-400 cursor-not-allowed pr-12"
                  readOnly
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  🔒 Locked
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-700">
            <button
              type="button"
              className="px-8 py-3 border-2 border-gray-600 rounded-xl hover:bg-gray-700 
                hover:border-gray-500 text-gray-300 font-semibold transition-all duration-200
                hover:scale-[1.02] flex items-center gap-2"
              onClick={() => navigate(`/profile/${userData?.uid}`)}
            >
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl
                hover:from-blue-700 hover:to-cyan-700 text-white font-semibold transition-all
                duration-200 hover:scale-[1.02] flex items-center gap-2"
            >
              💾 Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
