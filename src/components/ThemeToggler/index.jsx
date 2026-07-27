import React from "react";
import { FaSun, FaMoon, FaVolumeUp } from "react-icons/fa";

const ThemeToggler = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isLight = theme === "light";

  return (
    <div
      className="w-full max-w-xl backdrop-blur-md p-8 md:p-10 shadow-2xl text-center rounded-2xl transition-all duration-300"
      style={
        isLight
          ? {
              background: "rgba(255, 255, 255, 0.75)",
              border: "1px solid rgba(255,255,255,0.9)",
              color: "#0f172a",
              boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
            }
          : {
              background: "rgba(17, 24, 39, 0.6)",
              border: "1px solid rgba(75,85,99,0.5)",
              color: "#ffffff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }
      }
    >
      <h3
        className="text-2xl font-bold mb-4"
        style={{ color: isLight ? "#0f172a" : "#ffffff" }}
      >
        Theme &amp; Weather Atmosphere
      </h3>

      <p
        className="mb-6 text-sm md:text-base leading-relaxed"
        style={{ color: isLight ? "#1e293b" : "#d1d5db" }}
      >
        {isLight
          ? "Currently experiencing the light theme storm with floating clouds and lightning. Switch back for dark mode calm."
          : "Currently viewing the calm cosmic dark theme. Switch to experience the light theme's electric thunderstorm!"}
      </p>

      {/* Sound Warning — light mode only */}
      {isLight && (
        <div
          className="mb-6 p-4 rounded-xl text-xs md:text-sm flex items-start md:items-center gap-3 text-left animate-fade-in"
          style={{
            background: "rgba(251,191,36,0.15)",
            border: "1px solid rgba(251,191,36,0.5)",
            color: "#92400e",
          }}
        >
          <FaVolumeUp
            className="text-lg shrink-0 mt-0.5 md:mt-0 animate-pulse"
            style={{ color: "#b45309" }}
          />
          <div>
            <span className="font-semibold block md:inline mr-1" style={{ color: "#78350f" }}>
              ⚠️ Sound Warning:
            </span>
            Light theme features dynamic thunder and lightning audio effects. Please ensure your
            audio volume is set to a comfortable level!
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="flex justify-center items-center">
        <button
          onClick={toggleTheme}
          className="relative inline-flex items-center h-14 w-28 rounded-full cursor-pointer transition-colors duration-500 focus:outline-none"
          style={
            isLight
              ? {
                  background: "rgba(226,232,240,0.9)",
                  border: "1px solid rgba(148,163,184,0.6)",
                }
              : {
                  background: "rgba(3,7,18,0.8)",
                  border: "1px solid rgba(75,85,99,0.6)",
                }
          }
          aria-label="Toggle theme"
        >
          {/* Sliding circle */}
          <span
            className={`inline-flex w-10 h-10 transform rounded-full transition-all duration-500 items-center justify-center ${
              isLight
                ? "translate-x-15 bg-blue-500 shadow-[0_0_20px_#3b82f6]"
                : "translate-x-2 bg-orange-500 shadow-[0_0_20px_#f97316]"
            }`}
          >
            {isLight ? (
              <FaSun className="text-white text-lg" />
            ) : (
              <FaMoon className="text-white text-lg" />
            )}
          </span>

          {/* Ghost icons inside slot */}
          <span
            className="absolute left-4.5 pointer-events-none"
            style={{ color: isLight ? "#94a3b8" : "#4b5563" }}
          >
            {isLight && <FaMoon size={14} />}
          </span>
          <span
            className="absolute right-4.5 pointer-events-none"
            style={{ color: isLight ? "#94a3b8" : "#4b5563" }}
          >
            {!isLight && <FaSun size={14} />}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggler;
