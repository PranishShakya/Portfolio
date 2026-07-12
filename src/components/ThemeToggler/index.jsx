import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggler = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
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
