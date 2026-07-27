import React, { useState, useEffect, useMemo } from "react";
import { FaVolumeUp, FaTimes } from "react-icons/fa";
import { playThunderSound } from "../../utils/audio";

const WeatherBackground = ({ activeTheme }) => {
  const [lightningTrigger, setLightningTrigger] = useState(false);
  const [boltIndex, setBoltIndex] = useState(0);
  const [showAudioWarning, setShowAudioWarning] = useState(false);

  // Auto-dismiss floating warning popup after 5 seconds or if previously dismissed in session
  useEffect(() => {
    if (activeTheme !== "light") {
      setShowAudioWarning(false);
      return;
    }

    if (sessionStorage.getItem("light_theme_audio_warning_dismissed") === "true") {
      setShowAudioWarning(false);
      return;
    }

    setShowAudioWarning(true);
    const autoDismissTimer = setTimeout(() => {
      setShowAudioWarning(false);
    }, 5000);

    return () => clearTimeout(autoDismissTimer);
  }, [activeTheme]);

  // SVG Lightning Paths for realistic branching lightning
  const boltPaths = useMemo(() => [
    // Jagged Bolt 1
    (
      <>
        <path
          d="M 50 0 L 45 40 L 58 70 L 38 120 L 62 160 L 48 210 L 58 260 L 50 300"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 45 40 L 25 70 L 15 100"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 38 120 L 55 150 L 68 175"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 48 210 L 30 240 L 20 280"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    // Jagged Bolt 2
    (
      <>
        <path
          d="M 40 0 L 50 50 L 35 100 L 60 150 L 42 200 L 55 250 L 38 300"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 50 L 70 85 L 85 110"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 60 150 L 40 185 L 30 230"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    // Jagged Bolt 3 (intense branching)
    (
      <>
        <path
          d="M 50 0 L 55 35 L 42 80 L 65 130 L 48 180 L 58 230 L 50 300"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 55 35 L 75 60 L 85 90"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 42 80 L 20 120 L 10 160"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 48 180 L 65 210 L 78 245"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )
  ], []);

  // Lightning timing trigger loop
  useEffect(() => {
    if (activeTheme !== "light") return;

    let isMounted = true;
    let nextTimeoutId = null;

    const triggerStrike = () => {
      if (!isMounted) return;

      const randomIdx = Math.floor(Math.random() * boltPaths.length);
      setBoltIndex(randomIdx);
      setLightningStyle({
        left: `${10 + Math.random() * 75}%`,
        top: `${-5 + Math.random() * 15}%`,
        transform: `scale(${0.85 + Math.random() * 0.65}) scaleX(${Math.random() > 0.5 ? 1 : -1})`,
      });
      setLightningTrigger(true);
      playThunderSound();

      // Broadcast lightning event so BurnEffect can react globally
      window.dispatchEvent(new CustomEvent("lightning-strike"));

      setTimeout(() => {
        if (isMounted) setLightningTrigger(false);
      }, 700);

      // Schedule next strike in 3.5 to 7.5 seconds
      const nextDelay = 3500 + Math.random() * 4000;
      nextTimeoutId = setTimeout(triggerStrike, nextDelay);
    };

    // Initial lightning strike 200ms after switching to light mode
    const initialId = setTimeout(triggerStrike, 200);

    return () => {
      isMounted = false;
      clearTimeout(initialId);
      if (nextTimeoutId) clearTimeout(nextTimeoutId);
    };
  }, [activeTheme, boltPaths]);

  if (activeTheme !== "light") return null;

  return (
    <>
      {/* Dynamic Screen Flash Overlay (in front of page content) */}
      {lightningTrigger && (
        <div className="fixed inset-0 pointer-events-none z-[44] bg-white/80 animate-lightning-flash" />
      )}

      {/* High-Visibility Electric Lightning Bolt SVG (in front of page content) */}
      {lightningTrigger && (
        <svg
          className="fixed z-[45] pointer-events-none transition-all duration-75"
          style={{
            ...lightningStyle,
            width: "360px",
            height: "640px",
            filter: "drop-shadow(0 0 30px #00f0ff) drop-shadow(0 0 60px #ffffff) drop-shadow(0 0 90px #38bdf8)",
          }}
          viewBox="0 0 100 300"
        >
          {boltPaths[boltIndex]}
        </svg>
      )}

      {/* Continuous Animated Rain Drops Container (z-10 layer) */}
      <div className="fixed inset-0 pointer-events-none z-[10] overflow-hidden">
        {Array.from({ length: 45 }).map((_, i) => {
          const left = `${(i * 2.2 + (i % 7) * 3) % 100}%`;
          const duration = `${0.6 + (i % 5) * 0.18}s`;
          const delay = `-${(i % 10) * 0.15}s`;
          const opacity = 0.5 + (i % 4) * 0.15;
          const height = `${35 + (i % 6) * 8}px`;

          return (
            <div
              key={i}
              className="rain-drop"
              style={{
                left,
                height,
                opacity,
                animationDuration: duration,
                animationDelay: delay,
              }}
            />
          );
        })}
      </div>

      {/* Floating Stormy Clouds Background Container (z-1 layer) */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-90">
        {[
          { id: 1, top: "4%", size: "scale-110", speed: "animation-duration-[40s]", delay: "animation-delay-[-5s]" },
          { id: 2, top: "18%", size: "scale-90 opacity-90", speed: "animation-duration-[55s]", delay: "animation-delay-[-20s]" },
          { id: 3, top: "35%", size: "scale-125 opacity-95", speed: "animation-duration-[35s]", delay: "animation-delay-[-2s]" },
          { id: 4, top: "52%", size: "scale-100 opacity-85", speed: "animation-duration-[50s]", delay: "animation-delay-[-30s]" },
          { id: 5, top: "70%", size: "scale-115 opacity-90", speed: "animation-duration-[42s]", delay: "animation-delay-[-12s]" },
          { id: 6, top: "85%", size: "scale-85 opacity-75", speed: "animation-duration-[60s]", delay: "animation-delay-[-25s]" },
        ].map((c) => (
          <div
            key={c.id}
            className={`absolute left-0 w-0 h-0 animate-cloud-move ${c.speed} ${c.delay}`}
            style={{ top: c.top }}
          >
            <div className={`relative ${c.size}`}>
              <div className="cloud" />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* Continuous Falling Rain Drops */
        @keyframes rain-fall {
          0% {
            transform: translateY(-80px);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(105vh);
            opacity: 0;
          }
        }

        .rain-drop {
          position: absolute;
          top: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.8), rgba(255, 255, 255, 0.95));
          animation: rain-fall linear infinite;
        }

        /* Dark Storm Cloud Drawing via CSS shapes */
        .cloud {
          width: 440px;
          height: 140px;
          background: linear-gradient(to bottom, #334155, #1e293b); /* dark stormy cloud gradient */
          border-radius: 100px;
          position: absolute;
          filter: blur(6px);
          box-shadow: 
            inset -20px -15px 40px rgba(15, 23, 42, 0.5),
            0 25px 45px rgba(15, 23, 42, 0.35);
        }
        .cloud::before {
          content: '';
          position: absolute;
          background: #475569;
          width: 200px;
          height: 200px;
          top: -95px;
          left: 55px;
          border-radius: 50%;
        }
        .cloud::after {
          content: '';
          position: absolute;
          background: #334155;
          width: 160px;
          height: 160px;
          top: -75px;
          right: 55px;
          border-radius: 50%;
        }

        /* Animation: Cloud float from left boundary to right boundary */
        @keyframes cloud-move {
          0% {
            transform: translateX(-450px);
          }
          100% {
            transform: translateX(calc(100vw + 450px));
          }
        }
        
        .animate-cloud-move {
          animation-name: cloud-move;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        /* Lightning Double Flash Animation */
        @keyframes flash-lightning {
          0%, 100% { opacity: 0; }
          10%, 40% { opacity: 0.85; }
          22% { opacity: 0.15; }
          50% { opacity: 0.05; }
        }
        
        .animate-lightning-flash {
          animation: flash-lightning 0.65s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* Tailwind custom utilities for arbitrary durations/delays */
        .animation-duration-\\[35s\\] { animation-duration: 35s; }
        .animation-duration-\\[40s\\] { animation-duration: 40s; }
        .animation-duration-\\[42s\\] { animation-duration: 42s; }
        .animation-duration-\\[50s\\] { animation-duration: 50s; }
        .animation-duration-\\[55s\\] { animation-duration: 55s; }
        .animation-duration-\\[60s\\] { animation-duration: 60s; }
        
        .animation-delay-\\[-2s\\] { animation-delay: -2s; }
        .animation-delay-\\[-5s\\] { animation-delay: -5s; }
        .animation-delay-\\[-12s\\] { animation-delay: -12s; }
        .animation-delay-\\[-20s\\] { animation-delay: -20s; }
        .animation-delay-\\[-25s\\] { animation-delay: -25s; }
        .animation-delay-\\[-30s\\] { animation-delay: -30s; }
      `}</style>

      {/* Floating Sound Warning Badge / Toast for Light Theme */}
      {showAudioWarning && (
        <div className="fixed bottom-6 right-6 z-[99999] pointer-events-auto bg-gray-900/95 backdrop-blur-md text-amber-300 border border-amber-500/40 px-4 py-3 rounded-2xl text-xs md:text-sm flex items-center gap-3 shadow-2xl transition-all duration-300 max-w-xs md:max-w-sm">
          <FaVolumeUp className="text-amber-400 text-lg shrink-0 animate-pulse" />
          <div className="flex-1">
            <span className="font-semibold text-amber-200 block">⚡ Sound Warning</span>
            Light theme storm features live thunder sound synthesis.
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowAudioWarning(false);
              sessionStorage.setItem("light_theme_audio_warning_dismissed", "true");
            }}
            className="text-gray-400 hover:text-white p-1.5 transition-colors rounded-lg hover:bg-gray-800 focus:outline-none cursor-pointer"
            aria-label="Dismiss warning"
          >
            <FaTimes size={14} />
          </button>
        </div>
      )}
    </>
  );
};

export default WeatherBackground;
