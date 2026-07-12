import React, { useState, useEffect, useRef } from "react";

const CustomCursor = ({ theme = "dark" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true); // Hide by default until mouse moves
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  // Mouse positions
  const mouseRef = useRef({ x: 0, y: 0 });
  const outlinePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if it's a touch device
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(touchDevice);
    if (touchDevice) return; // Disable cursor follower for touch screens

    const handleMouseMove = (e) => {
      setIsHidden(false);
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Update inner dot immediately
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    // Global listener to check if hovering interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest("input[type='checkbox']") ||
        target.closest("input[type='file']") ||
        target.closest("label") ||
        target.classList.contains("cursor-pointer");

      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    // Frame-based animation loop for the outer trailing ring (easing/interpolation)
    let animationFrameId;
    
    const animateOutline = () => {
      // Lerp calculations: Outline position moves 15% closer to mouse position per frame
      const ease = 0.15;
      
      const dx = mouseRef.current.x - outlinePosRef.current.x;
      const dy = mouseRef.current.y - outlinePosRef.current.y;
      
      outlinePosRef.current.x += dx * ease;
      outlinePosRef.current.y += dy * ease;

      if (outlineRef.current) {
        outlineRef.current.style.left = `${outlinePosRef.current.x}px`;
        outlineRef.current.style.top = `${outlinePosRef.current.y}px`;
      }

      animationFrameId = requestAnimationFrame(animateOutline);
    };

    animateOutline();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isTouchDevice || isHidden) return null;

  return (
    <>
      {/* Dynamic Themed Custom Cursor Wrapper */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] transition-all duration-300 ease-out"
        style={{
          left: "-100px",
          top: "-100px",
          transform: isHovered 
            ? "translate(-50%, -16%)" // align pointer tip with click coordinates
            : "translate(-50%, -50%)", // center satellite/cloud on coordinates
        }}
      >
        {isHovered ? (
          // Hover state: Glow Hand (themed colors)
          theme === "light" ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path 
                d="M9 10 V5.5 A1.5 1.5 0 0 1 12 5.5 V10 M12 10 V7.5 A1.5 1.5 0 0 1 15 7.5 V10 M15 10 V8.5 A1.5 1.5 0 0 1 18 8.5 V11 M9 10 V8 A1.5 1.5 0 0 0 6 8 V14.5 A5.5 5.5 0 0 0 11.5 20 H12 A5.5 5.5 0 0 0 17.5 14.5 V11 M6 11.5 L4.5 10 A1.2 1.2 0 0 0 2.8 11.8 L5.5 14.5" 
                stroke="#0284c7" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="rgba(2, 132, 199, 0.15)"
                style={{ filter: "drop-shadow(0 0 4px rgba(2, 132, 199, 0.5))" }}
              />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path 
                d="M9 10 V5.5 A1.5 1.5 0 0 1 12 5.5 V10 M12 10 V7.5 A1.5 1.5 0 0 1 15 7.5 V10 M15 10 V8.5 A1.5 1.5 0 0 1 18 8.5 V11 M9 10 V8 A1.5 1.5 0 0 0 6 8 V14.5 A5.5 5.5 0 0 0 11.5 20 H12 A5.5 5.5 0 0 0 17.5 14.5 V11 M6 11.5 L4.5 10 A1.2 1.2 0 0 0 2.8 11.8 L5.5 14.5" 
                stroke="#f97316" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="rgba(249, 115, 22, 0.15)"
                style={{ filter: "drop-shadow(0 0 6px rgba(249, 115, 22, 0.6))" }}
              />
            </svg>
          )
        ) : (
          // Idle state (Satellite in dark mode, Storm Cloud + Lightning in light mode)
          theme === "light" ? (
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 0 6px rgba(71, 85, 105, 0.4))" }}>
              {/* Cloud */}
              <path d="M5.5 14 C4.1 14 3 12.9 3 11.5 C3 10.2 3.9 9.2 5.1 9 C5.6 7 7.4 5.5 9.5 5.5 C12 5.5 14.1 7.3 14.5 9.7 C15.4 9.9 16 10.6 16 11.5 C16 12.6 15.1 13.5 14 13.5 L5.5 14 Z" 
                    fill="#cbd5e1" stroke="#475569" strokeWidth="1.2"/>
              {/* Lightning bolt */}
              <path d="M10.5 12 L8 15.5 L10.5 15.5 L9.5 19 L13 14.5 L10.5 14.5 Z" 
                    fill="#eab308" stroke="#ca8a04" strokeWidth="0.8">
                <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite"/>
              </path>
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              {/* Left Solar Panel */}
              <rect x="2" y="13" width="8" height="6" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1"/>
              <line x1="6" y1="13" x2="6" y2="19" stroke="#38bdf8" strokeWidth="0.5"/>
              <line x1="2" y1="16" x2="10" y2="16" stroke="#38bdf8" strokeWidth="0.5"/>

              {/* Right Solar Panel */}
              <rect x="22" y="13" width="8" height="6" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1"/>
              <line x1="26" y1="13" x2="26" y2="19" stroke="#38bdf8" strokeWidth="0.5"/>
              <line x1="22" y1="16" x2="30" y2="16" stroke="#38bdf8" strokeWidth="0.5"/>

              {/* Connectors */}
              <line x1="10" y1="16" x2="22" y2="16" stroke="#e2e8f0" strokeWidth="1.5"/>

              {/* Center Body */}
              <rect x="12" y="11" width="8" height="10" rx="1.5" fill="#f97316" stroke="#ea580c" strokeWidth="1"
                    style={{ filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.7))" }}/>
              <circle cx="16" cy="16" r="2" fill="#fff"/>

              {/* Antenna dish */}
              <path d="M13 6 C 13 6, 16 9, 19 6" stroke="#e2e8f0" strokeWidth="1" fill="none"/>
              <line x1="16" y1="9" x2="16" y2="11" stroke="#e2e8f0" strokeWidth="1"/>
              {/* Beacon dot */}
              <circle cx="16" cy="4" r="1.2" fill="#ef4444">
                <animate attributeName="opacity" values="1;0.1;1" dur="0.9s" repeatCount="indefinite"/>
              </circle>
            </svg>
          )
        )}
      </div>

      {/* Trailing follower circle */}
      <div
        ref={outlineRef}
        className={`fixed rounded-full pointer-events-none z-[9998] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}
        style={{ 
          left: "-100px", 
          top: "-100px",
          width: isHovered ? "56px" : "40px",
          height: isHovered ? "56px" : "40px",
          border: theme === "light"
            ? (isHovered ? "1px dashed rgba(2, 132, 199, 0.3)" : "1px dashed rgba(2, 132, 199, 0.15)")
            : (isHovered ? "1px dashed rgba(249, 115, 22, 0.3)" : "1px dashed rgba(249, 115, 22, 0.15)"),
          backgroundColor: theme === "light"
            ? (isHovered ? "rgba(2, 132, 199, 0.05)" : "transparent")
            : (isHovered ? "rgba(249, 115, 22, 0.05)" : "transparent")
        }}
      />
    </>
  );
};

export default CustomCursor;
