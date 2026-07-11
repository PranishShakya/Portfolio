import React from "react";

// Picture radius = 190px (380px / 2)
// All orbitSize values must be > 190 so planets stay OUTSIDE the picture
const planets = [
  {
    id: "mercury",
    size: 11,
    orbitSize: 225,   // radius from center → well outside 190px picture edge
    color: "#a8a8a8",
    shadow: "rgba(168,168,168,0.9)",
    duration: "5s",
    startAngle: 20,
    label: "HTML",
    labelColor: "#e34f26",
  },
  {
    id: "venus",
    size: 15,
    orbitSize: 265,
    color: "#f5c542",
    shadow: "rgba(245,197,66,0.95)",
    duration: "9s",
    startAngle: 90,
    label: "CSS",
    labelColor: "#264de4",
  },
  {
    id: "earth",
    size: 16,
    orbitSize: 310,
    color: "#4da6ff",
    shadow: "rgba(77,166,255,0.95)",
    duration: "14s",
    startAngle: 160,
    label: "React",
    labelColor: "#61dafb",
  },
  {
    id: "mars",
    size: 13,
    orbitSize: 358,
    color: "#ff6b35",
    shadow: "rgba(255,107,53,0.95)",
    duration: "21s",
    startAngle: 235,
    label: ".NET",
    labelColor: "#9b59ff",
  },
  {
    id: "jupiter",
    size: 22,
    orbitSize: 412,
    color: "#c8956c",
    shadow: "rgba(200,149,108,0.95)",
    duration: "32s",
    startAngle: 310,
    label: "SQL",
    labelColor: "#f29111",
  },
];

// Outer container must be at least 2 × largest orbitSize = 824px
const CONTAINER = 860;

const Picture = () => {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: `${CONTAINER}px`,
        height: `${CONTAINER}px`,
        maxWidth: "min(95vw, 95vh)",
        maxHeight: "min(95vw, 95vh)",
      }}
    >
      {/* ── Orbit rings (faint dotted guide lines) ─────────────── */}
      {planets.map((p) => (
        <div
          key={`orbit-${p.id}`}
          className="absolute rounded-full"
          style={{
            width: `${p.orbitSize * 2}px`,
            height: `${p.orbitSize * 2}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "1px dashed rgba(255,255,255,0.06)",
          }}
        />
      ))}

      {/* ── Planets ────────────────────────────────────────────── */}
      {planets.map((p) => (
        <div
          key={`planet-wrap-${p.id}`}
          className="absolute"
          style={{
            width: `${p.orbitSize * 2}px`,
            height: `${p.orbitSize * 2}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: `orbit-spin ${p.duration} linear infinite`,
            "--start-angle": `${p.startAngle}deg`,
          }}
        >
          {/* Planet dot at top of orbit */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%) translateY(-50%)",
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, white, ${p.color})`,
              boxShadow: `0 0 ${p.size * 2}px 4px ${p.shadow}, 0 0 ${p.size * 4}px 2px ${p.shadow}`,
            }}
          >
            {/* Counter-rotating tech label */}
            <div
              style={{
                position: "absolute",
                top: `${p.size + 6}px`,
                left: "50%",
                transform: "translateX(-50%)",
                animation: `orbit-spin-reverse ${p.duration} linear infinite`,
                whiteSpace: "nowrap",
                fontSize: "10px",
                fontWeight: "800",
                letterSpacing: "0.06em",
                color: p.labelColor,
                textShadow: `0 0 10px ${p.labelColor}, 0 0 20px ${p.labelColor}`,
              }}
            >
              {p.label}
            </div>
          </div>
        </div>
      ))}

      {/* ── Profile Picture ────────────────────────────────────── */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ width: "380px", height: "380px" }}
      >
        {/* Large outer glow ring — pulsing */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            inset: "-6px",
            border: "4px solid #f97316",
            boxShadow:
              "0 0 50px 18px rgba(255,150,0,0.45), " +
              "0 0 90px 30px rgba(255,120,0,0.2), " +
              "inset 0 0 40px 10px rgba(255,150,0,0.35)",
          }}
        />

        {/* Second slower fade ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "-18px",
            border: "2px solid rgba(249,115,22,0.2)",
            animation: "pulse 4s ease-in-out infinite 0.8s",
          }}
        />

        {/* Third outermost faint ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "-34px",
            border: "1px solid rgba(249,115,22,0.08)",
            animation: "pulse 6s ease-in-out infinite 1.6s",
          }}
        />

        {/* Portrait image */}
        <div
          className="relative rounded-full overflow-hidden bg-gray-900"
          style={{
            width: "374px",
            height: "374px",
            border: "3px solid rgba(249,115,22,0.4)",
            zIndex: 10,
          }}
        >
          <img
            src="pra1.png"
            alt="Pranish Shakya"
            className="w-full h-full object-cover object-top"
          />
          {/* Bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      </div>

      {/* ── Keyframes ──────────────────────────────────────────── */}
      <style>{`
        @keyframes orbit-spin {
          from { transform: translate(-50%, -50%) rotate(var(--start-angle, 0deg)); }
          to   { transform: translate(-50%, -50%) rotate(calc(var(--start-angle, 0deg) + 360deg)); }
        }
        @keyframes orbit-spin-reverse {
          from { transform: translateX(-50%) rotate(0deg); }
          to   { transform: translateX(-50%) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default Picture;
