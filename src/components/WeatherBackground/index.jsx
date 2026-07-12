import React, { useState, useEffect, useMemo } from "react";

const WeatherBackground = ({ activeTheme }) => {
  const [lightningTrigger, setLightningTrigger] = useState(false);
  const [boltIndex, setBoltIndex] = useState(0);
  const [lightningStyle, setLightningStyle] = useState({});

  // SVG Lightning Paths for realistic branching lightning
  const boltPaths = useMemo(() => [
    // Jagged Bolt 1
    (
      <>
        <path
          d="M 50 0 L 45 40 L 58 70 L 38 120 L 62 160 L 48 210 L 58 260 L 50 300"
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 45 40 L 25 70 L 15 100"
          fill="none"
          stroke="#bae6fd"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 38 120 L 55 150 L 68 175"
          fill="none"
          stroke="#bae6fd"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 48 210 L 30 240 L 20 280"
          fill="none"
          stroke="#bae6fd"
          strokeWidth="1.8"
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
          stroke="#e0f2fe"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 50 L 70 85 L 85 110"
          fill="none"
          stroke="#bae6fd"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 60 150 L 40 185 L 30 230"
          fill="none"
          stroke="#bae6fd"
          strokeWidth="2.5"
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
          stroke="#e0f2fe"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 55 35 L 75 60 L 85 90"
          fill="none"
          stroke="#bae6fd"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 42 80 L 20 120 L 10 160"
          fill="none"
          stroke="#bae6fd"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 48 180 L 65 210 L 78 245"
          fill="none"
          stroke="#bae6fd"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )
  ], []);

  // Lightning timing trigger
  useEffect(() => {
    if (activeTheme !== "light") return;

    let timer;
    const triggerLightning = () => {
      const randomIdx = Math.floor(Math.random() * boltPaths.length);
      setBoltIndex(randomIdx);
      setLightningStyle({
        left: `${15 + Math.random() * 70}%`,
        top: `${-10 + Math.random() * 20}%`,
        transform: `scale(${0.6 + Math.random() * 0.9}) scaleX(${Math.random() > 0.5 ? 1 : -1})`,
      });
      setLightningTrigger(true);

      setTimeout(() => {
        setLightningTrigger(false);
      }, 700);
    };

    const scheduleNext = () => {
      // Trigger a lightning strike every 5 to 11 seconds
      const delay = 5000 + Math.random() * 6000;
      timer = setTimeout(() => {
        triggerLightning();
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, [activeTheme, boltPaths]);

  if (activeTheme !== "light") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Dynamic Lightning Flash Screen Overlay */}
      {lightningTrigger && (
        <div className="absolute inset-0 bg-sky-100/90 mix-blend-overlay z-[2] animate-lightning-flash" />
      )}

      {/* Lightning Bolt SVG rendering */}
      {lightningTrigger && (
        <svg
          className="absolute z-[3]"
          style={{
            ...lightningStyle,
            width: "220px",
            height: "450px",
            filter: "drop-shadow(0 0 15px rgba(224, 242, 254, 0.95)) drop-shadow(0 0 35px rgba(56, 189, 248, 0.6))",
          }}
          viewBox="0 0 100 300"
        >
          {boltPaths[boltIndex]}
        </svg>
      )}

      {/* Floating Clouds Container */}
      <div className="absolute inset-0 z-[1] opacity-70">
        {[
          { id: 1, top: "8%", size: "scale-100", speed: "animation-duration-[55s]", delay: "animation-delay-[-10s]" },
          { id: 2, top: "25%", size: "scale-75 opacity-80", speed: "animation-duration-[75s]", delay: "animation-delay-[-25s]" },
          { id: 3, top: "45%", size: "scale-125 opacity-90", speed: "animation-duration-[45s]", delay: "animation-delay-[-5s]" },
          { id: 4, top: "62%", size: "scale-90 opacity-75", speed: "animation-duration-[65s]", delay: "animation-delay-[-40s]" },
          { id: 5, top: "78%", size: "scale-110", speed: "animation-duration-[50s]", delay: "animation-delay-[-15s]" },
          { id: 6, top: "90%", size: "scale-80 opacity-60", speed: "animation-duration-[80s]", delay: "animation-delay-[-30s]" },
        ].map((c) => (
          <div
            key={c.id}
            className={`absolute left-0 w-0 h-0 animate-cloud-move ${c.speed} ${c.delay}`}
            style={{ top: c.top }}
          >
            <div className={`relative ${c.size} opacity-90`}>
              <div className="cloud" />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* Cloud Drawing via CSS shapes */
        .cloud {
          width: 380px;
          height: 120px;
          background: linear-gradient(to bottom, #cbd5e1, #94a3b8); /* dark stormy cloud gradient */
          border-radius: 100px;
          position: absolute;
          filter: blur(12px);
          box-shadow: 
            inset -20px -15px 40px rgba(15, 23, 42, 0.2),
            0 25px 35px rgba(15, 23, 42, 0.15);
        }
        .cloud::before {
          content: '';
          position: absolute;
          background: #cbd5e1;
          width: 180px;
          height: 180px;
          top: -90px;
          left: 50px;
          border-radius: 50%;
        }
        .cloud::after {
          content: '';
          position: absolute;
          background: #94a3b8;
          width: 140px;
          height: 140px;
          top: -70px;
          right: 50px;
          border-radius: 50%;
        }

        /* Animation: Cloud float from left boundary to right boundary */
        @keyframes cloud-move {
          0% {
            transform: translateX(-400px);
          }
          100% {
            transform: translateX(calc(100vw + 400px));
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
          12%, 35% { opacity: 1; }
          20% { opacity: 0.25; }
          45% { opacity: 0.1; }
        }
        
        .animate-lightning-flash {
          animation: flash-lightning 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* Tailwind custom utilities for arbitrary durations/delays */
        .animation-duration-\\[45s\\] { animation-duration: 45s; }
        .animation-duration-\\[50s\\] { animation-duration: 50s; }
        .animation-duration-\\[55s\\] { animation-duration: 55s; }
        .animation-duration-\\[65s\\] { animation-duration: 65s; }
        .animation-duration-\\[75s\\] { animation-duration: 75s; }
        .animation-duration-\\[80s\\] { animation-duration: 80s; }
        
        .animation-delay-\\[-5s\\] { animation-delay: -5s; }
        .animation-delay-\\[-10s\\] { animation-delay: -10s; }
        .animation-delay-\\[-15s\\] { animation-delay: -15s; }
        .animation-delay-\\[-25s\\] { animation-delay: -25s; }
        .animation-delay-\\[-30s\\] { animation-delay: -30s; }
        .animation-delay-\\[-40s\\] { animation-delay: -40s; }
      `}</style>
    </div>
  );
};

export default WeatherBackground;
