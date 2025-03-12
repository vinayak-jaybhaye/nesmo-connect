import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
                {[...Array(50)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-gray-400 rounded-full animate-twinkle"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center space-y-8 px-4">
                {/* Error number display */}
                <div className="flex items-center justify-center space-x-4 md:space-x-8">
                    <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent animate-gradient-pulse">
                        4
                    </span>
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full shadow-xl animate-float" />
                    <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent animate-gradient-pulse">
                        4
                    </span>
                </div>

                {/* Message section */}
                <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-light text-gray-300">
                        Page Lost in the Mist
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                        The content you're seeking seems to have vanished into the digital fog. 
                        Let's navigate back to clearer paths.
                    </p>
                </div>

                {/* Return button */}
                <Link
                    to="/"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-gray-100 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-gray-900/30 relative group"
                >
                    <span className="relative z-10">Return to Clarity</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -rotate-45" />
                </Link>
            </div>

            {/* Floating elements */}
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gray-600/20 rounded-full blur-xl animate-orb-move-1" />
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gray-500/10 rounded-full blur-lg animate-orb-move-2" />
        </div>
    );
};

export default Error;