import React from "react";
import { FaSun, FaMoon, FaVolumeUp } from "react-icons/fa";
import { playThunderSound } from "../../utils/audio";

const ThemeToggler = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      if (nextTheme === "light") {
        playThunderSound();
      }
      return nextTheme;
    });
  };

  return (
    <div className="w-full max-w-xl bg-gray-900/60 backdrop-blur-md p-8 md:p-10 shadow-2xl text-white text-center rounded-2xl border border-gray-800/80 transition-all duration-300">
      <h3 className="text-2xl font-bold mb-4">
        Theme & Weather Atmosphere
      </h3>
      <p className="text-gray-300 mb-6 text-sm md:text-base leading-relaxed">
        {theme === "dark" 
          ? "Currently viewing the calm cosmic dark theme. Switch to experience the light theme's electric thunderstorm!"
          : "Currently experiencing the light theme storm with floating clouds and lightning. Switch back for dark mode calm."
        }
      </p>

      {/* Sound Warning Banner for Light Theme */}
      {theme === "light" && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs md:text-sm flex items-start md:items-center gap-3 text-left shadow-inner animate-fade-in">
          <FaVolumeUp className="text-amber-400 text-lg shrink-0 mt-0.5 md:mt-0 animate-pulse" />
          <div>
            <span className="font-semibold text-amber-200 block md:inline mr-1">⚠️ Sound Warning:</span>
            Light theme features dynamic thunder and lightning audio effects. Please ensure your audio volume is set to a comfortable level!
          </div>
        </div>
      )}
      
      <div className="flex justify-center items-center">
        <button
          onClick={toggleTheme}
          className="relative inline-flex items-center h-14 w-28 rounded-full cursor-pointer transition-colors duration-500 focus:outline-none bg-gray-950/80 border border-gray-800/80"
          aria-label="Toggle theme"
        >
          {/* Toggle sliding circle */}
          <span
            className={`inline-block w-10 h-10 transform rounded-full transition-all duration-500 flex items-center justify-center ${
              theme === "light"
                ? "translate-x-15 bg-blue-500 shadow-[0_0_20px_#3b82f6]"
                : "translate-x-2 bg-orange-500 shadow-[0_0_20px_#f97316]"
            }`}
          >
            {theme === "light" ? (
              <FaSun className="text-white text-lg" />
            ) : (
              <FaMoon className="text-white text-lg" />
            )}
          </span>
          
          {/* Hidden indicators inside slot */}
          <span className="absolute left-4.5 text-gray-600 pointer-events-none">
            {theme === "light" && <FaMoon size={14} />}
          </span>
          <span className="absolute right-4.5 text-gray-600 pointer-events-none">
            {theme === "dark" && <FaSun size={14} />}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggler;
