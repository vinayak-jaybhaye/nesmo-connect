import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dbServices from "../firebase/firebaseDb";
import { useUserLocation } from "../components/helpers";
import {
  Save,
  X,
  Linkedin,
  Twitter,
  Mail,
  Github,
  Globe,
  MapPin,
  Briefcase,
  GraduationCap,
  User,
  Calendar,
  Lock,
  AlertCircle,
} from "lucide-react";

function EditProfile() {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const userData = useSelector((state) => state.auth.userData);
  const { location, error: locationError } = useUserLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    if (!userData) {
      navigate("/");
    } else if (profileId && profileId !== userData.uid) {
      // Prevent editing other users' profiles
      navigate(`/profile/${profileId}`);
    }
  }, [userData, navigate, profileId]);

  // useEffect(() => {
  //   if (location) {
  //     console.log("User Location:", location);
  //   }
  // }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      const form = e.target;
      const formData = new FormData(form);

      // Extract skills and interests from comma-separated strings
      const skillsString = formData.get("skills") || "";
      const interestsString = formData.get("interests") || "";

      const skills = skillsString
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const interests = interestsString
        .split(",")
        .map((interest) => interest.trim())
        .filter((interest) => interest.length > 0);

      const personalData = {
        email: formData.get("secondaryEmail"),
        linkedin: formData.get("linkedin"),
        twitter: formData.get("twitter"),
        github: formData.get("github"),
        website: formData.get("website"),
        education: formData.get("education"),
        position: formData.get("position"),
        location: location || userData.personalData?.location,
        city: formData.get("city"),
        batch: formData.get("batch"),
        about: formData.get("about"),
        skills,
        interests,
      };

      const updatedProfile = {
        name: formData.get("name"),
        personalData,
      };

      await dbServices.updateDocument("users", userData.uid, updatedProfile);
      setFormSuccess(true);

      // Navigate back to profile after short delay to show success message
      setTimeout(() => {
        navigate(`/profile/${userData.uid}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setFormError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 p-2">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        {/* <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Edit Profile
          </h1>
          <button
            type="button"
            onClick={() => navigate(`/profile/${userData.uid}`)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Back to profile"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div> */}

        {/* Form */}
        <form
          className="space-y-4 bg-gray-800/30 rounded-xl p-2 md:p-4 border border-gray-700/50 shadow-xl backdrop-blur-sm"
          onSubmit={handleSubmit}
        >
          {/* Error message */}
          {formError && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-200">{formError}</p>
            </div>
          )}

          {/* Success message */}
          {formSuccess && (
            <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-green-200">
                Profile updated successfully! Redirecting...
              </p>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-white">
                Basic Information
              </h2>
              <div className="ml-4 h-px bg-gradient-to-r from-indigo-500 to-transparent flex-grow"></div>
            </div>

            {/* Name */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  defaultValue={userData?.name || ""}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                    transition-all duration-200 text-gray-200 placeholder-gray-500"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Education & Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Education
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    name="education"
                    defaultValue={userData?.personalData?.education || ""}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                      transition-all duration-200 text-gray-200 placeholder-gray-500"
                    placeholder="Degree & University"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Current Position
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    name="position"
                    defaultValue={userData?.personalData?.position || ""}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                      transition-all duration-200 text-gray-200 placeholder-gray-500"
                    placeholder="Job title & Company"
                  />
                </div>
              </div>
            </div>

            {/* Location & Batch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    name="city"
                    defaultValue={userData?.personalData?.city || ""}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                      transition-all duration-200 text-gray-200 placeholder-gray-500"
                    placeholder="City, Country"
                  />
                  {locationError && (
                    <p className="mt-1 text-xs text-yellow-400">
                      {locationError}. Please enter your location manually.
                    </p>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Batch / Year
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    name="batch"
                    defaultValue={userData?.personalData?.batch || ""}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                      transition-all duration-200 text-gray-200 placeholder-gray-500"
                    placeholder="Graduation year"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-white">About</h2>
              <div className="ml-4 h-px bg-gradient-to-r from-indigo-500 to-transparent flex-grow"></div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Bio
              </label>
              <textarea
                name="about"
                defaultValue={userData?.personalData?.about || ""}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                  transition-all duration-200 text-gray-200 placeholder-gray-500 min-h-[120px]"
                placeholder="Tell us about yourself, your experience, interests, and goals..."
              />
              <p className="mt-1 text-xs text-gray-400">
                Share your background, experience, and what you're passionate
                about.
              </p>
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="space-y-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-white">
                Skills & Interests
              </h2>
              <div className="ml-4 h-px bg-gradient-to-r from-indigo-500 to-transparent flex-grow"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  defaultValue={(userData?.personalData?.skills || []).join(
                    ", "
                  )}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                    transition-all duration-200 text-gray-200 placeholder-gray-500"
                  placeholder="JavaScript, React, Project Management"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Separate skills with commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Interests
                </label>
                <input
                  type="text"
                  name="interests"
                  defaultValue={(userData?.personalData?.interests || []).join(
                    ", "
                  )}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                    transition-all duration-200 text-gray-200 placeholder-gray-500"
                  placeholder="AI, Education, Sustainability"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Separate interests with commas
                </p>
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-white">Social Links</h2>
              <div className="ml-4 h-px bg-gradient-to-r from-indigo-500 to-transparent flex-grow"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  LinkedIn
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="w-5 h-5 text-blue-500" />
                  </div>
                  <input
                    type="url"
                    name="linkedin"
                    defaultValue={userData?.personalData?.linkedin || ""}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                      transition-all duration-200 text-gray-200 placeholder-gray-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Twitter
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Twitter className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type="url"
                    name="twitter"
                    defaultValue={userData?.personalData?.twitter || ""}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                      transition-all duration-200 text-gray-200 placeholder-gray-500"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  GitHub
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Github className="w-5 h-5 text-gray-300" />
                  </div>
                  <input
                    type="url"
                    name="github"
                    defaultValue={userData?.personalData?.github || ""}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                      transition-all duration-200 text-gray-200 placeholder-gray-500"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Website
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="w-5 h-5 text-green-400" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    defaultValue={userData?.personalData?.website || ""}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                      transition-all duration-200 text-gray-200 placeholder-gray-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Email Addresses Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-white">
                Email Addresses
              </h2>
              <div className="ml-4 h-px bg-gradient-to-r from-indigo-500 to-transparent flex-grow"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Email (Read-Only) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Primary Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={userData?.email || ""}
                    className="w-full pl-11 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg
                      text-gray-400 cursor-not-allowed"
                    readOnly
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    <span className="text-xs">Locked</span>
                  </div>
                </div>
              </div>

              {/* Secondary Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Secondary Email (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <input
                    type="email"
                    name="secondaryEmail"
                    defaultValue={userData?.personalData?.email || ""}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400
                      transition-all duration-200 text-gray-200 placeholder-gray-500"
                    placeholder="Secondary email address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-700 
                hover:border-gray-500 text-gray-300 font-medium transition-all duration-200
                flex items-center justify-center gap-2"
              onClick={() => navigate(`/profile/${userData?.uid}`)}
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg
                hover:from-indigo-700 hover:to-blue-700 text-white font-medium transition-all
                duration-200 flex items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
