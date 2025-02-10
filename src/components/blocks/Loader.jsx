function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50">
      <div className="relative flex items-center justify-center">
        {/* Spinner ring */}
        <div className="w-16 h-16 border-[3px] border-transparent border-t-blue-400/40 border-l-blue-500/40 rounded-full animate-spin shadow-lg"></div>

        {/* Bouncing center dot */}
        <div className="absolute flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-400/80 shadow-lg shadow-blue-500/30 rounded-full animate-bounce"></div>
        </div>

        {/* Orbiting dots */}
        {/* <div className="absolute -top-8 flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-2.5 h-2.5 bg-white/50 shadow-md shadow-white/30 rounded-full animate-orbit"
              style={{
                animation: `orbit 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            ></div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default Loader;
