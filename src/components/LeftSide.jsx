function LeftSide() {
  return (
    <div className="hidden  h-full md:flex md:w-1/2 bg-gray-900 p-8 items-center justify-center max-w-lg rounded-lg">
      <div className="max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="mb-4 text-4xl font-mono text-blue-500">
            NESMO CONNECT
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Connect & Collaborate
        </h1>
        <p className="text-gray-400">
          Join our platform to connect with NGOs worldwide, share resources, and
          make a greater impact together.
        </p>
        <div className="grid grid-cols-3 gap-4 pt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
            >
              <span className="text-blue-500 text-xl">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeftSide;
