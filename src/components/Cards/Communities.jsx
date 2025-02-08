import React from "react";

function Communities(communities = []) {
  //   communities = [{ name: "Community 1" }, { name: "Community 2" }];
  return (
    <div>
      <div className="p-4 bg-gray-900 shadow-lg shadow-black/40 rounded-lg border border-gray-800">
        <h2 className="text-sm font-bold mb-4 text-gray-100 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-green-500"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Communities
        </h2>
        {communities.length > 0 ? (
          <div className="w-full overflow-hidden flex flex-col">
            <div className="flex flex-col space-y-3">
              {communities.map((community) => (
                <div
                  key={community.name}
                  className="w-full p-2 bg-gray-800/80 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden relative w-full">
                      {/* <div className="w-8 h-8 bg-gray-700 rounded-full"></div> */}
                      <div className="overflow-hidden relative w-[100px]">
                        <p className="text-gray-100 text-sm font-semibold whitespace-nowrap animate-slide">
                          {community.name}
                        </p>
                        <p className="text-gray-400 text-xs animate-slide w-[80px] ">
                          Members: 100
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded-lg text-sm text-gray-100 whitespace-nowrap">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 animate-pulse">
            <p className="text-gray-400/70 italic mb-2 flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              No communities found
            </p>
            <p className="text-sm text-gray-400/80">
              Join a community to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Communities;
