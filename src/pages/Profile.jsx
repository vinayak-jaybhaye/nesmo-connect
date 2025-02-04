import React from "react";

function Profile() {
  return (
    <div className="flex flex-col h-[100%] bg-black overflow-auto scrollbar-hide">
      {/* Banner Section */}
      <div className="flex h-[35vh] bg-gray-800 overflow-hidden">
        <img
          src="/cat.jpeg"
          className="w-full h-full object-cover opacity-75"
          alt="Banner"
        />
      </div>

      {/* Profile Content */}
      <div className="flex flex-col h-[65vh] md:h-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row relative justify-end items-center md:items-start h-auto md:h-[40%] bg-gray-800 shadow-2xl p-4 md:p-6">
          {/* Profile Avatar */}
          <div className="absolute rounded-full h-32 w-32 md:h-[280px] md:w-[280px] -top-16 md:-top-36 left-1/2 md:left-20 transform -translate-x-1/2 md:translate-x-0 shadow-xl z-[1]">
            <img
              src="/dog.jpeg"
              className="rounded-full w-full h-full object-cover"
              alt="Profile"
            />
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row w-full md:w-[65%] justify-between items-center md:items-start p-4 rounded-tl-xl mt-16 md:mt-0">
            <div className="w-full md:w-[70%] text-center md:text-left space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
                LIONEL MESSI
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="px-4 py-1 bg-blue-900 text-gray-100 rounded-full">
                  Student
                </span>
                <button className="px-4 py-1 bg-blue-600 text-gray-100 rounded-full hover:bg-blue-500 transition">
                  Connect+
                </button>
              </div>

              <div className="flex gap-5 text-gray-400 justify-center md:justify-start items-center">
                <a href="#" className="hover:text-blue-400">
                  <img src="/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-blue-400">
                  <img src="/gmail.svg" alt="Email" className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-blue-400">
                  <img src="/twitter.svg" alt="Twitter" className="w-6 h-6" />
                </a>
              </div>
            </div>

            <button className="w-full md:w-[30%] h-fit px-6 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-full hover:bg-gray-600 transition mt-4 md:mt-0">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-gray-900 p-4 flex flex-col justify-evenly shadow-2xl h-[60%]">
          <div className="py-2 flex flex-col justify-evenly overflow-auto scrollbar-hide">
            <div className="flex flex-col md:flex-row justify-around text-gray-100 text-center md:text-left space-y-4 md:space-y-0">
              <div className="space-y-2">
                <div>
                  <label className="text-gray-400 text-sm">Education</label>
                  <p className="font-medium">La Masia Academy</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Location</label>
                  <p className="font-medium">Paris, France</p>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Current Position</label>
                <p className="font-medium">Football Player at PSG</p>
              </div>
            </div>

            <div className="space-y-2 px-4 md:pl-10">
              <h2 className="text-xl font-semibold text-gray-100">About</h2>
              <p className="text-gray-400 leading-relaxed">
                Professional footballer with exceptional technical skills and
                playmaking abilities. Known for vision, passing, and goal-scoring
                capabilities. Multiple Ballon d'Or winner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;