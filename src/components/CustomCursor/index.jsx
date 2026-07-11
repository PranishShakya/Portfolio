import React, { useState, useEffect, useRef } from "react";

const CustomCursor = () => {
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
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{ left: "-100px", top: "-100px" }}
      />
      {/* Outer Ring */}
      <div
        ref={outlineRef}
        className={`fixed rounded-full pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isHovered 
            ? "w-12 h-12 bg-orange-500/10 border border-orange-500 scale-110" 
            : "w-8 h-8 border border-orange-500/40"
        }`}
        style={{ left: "-100px", top: "-100px" }}
      />
    </>
  );
};

export default CustomCursor;
