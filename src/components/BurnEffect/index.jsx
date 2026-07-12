import React, { useEffect, useRef, useCallback } from "react";

/**
 * BurnEffect — Canvas-based fire & smoke particle system.
 * Listens for the "lightning-strike" custom DOM event and erupts
 * fire + smoke particles across the page content.
 */
const BurnEffect = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const isRunningRef = useRef(false);

  // ── Particle Factory ─────────────────────────────────────────────
  const createFireParticle = (x, y) => ({
    type: "fire",
    x: x + (Math.random() - 0.5) * 60,
    y: y + Math.random() * 30,
    vx: (Math.random() - 0.5) * 1.8,
    vy: -(1.5 + Math.random() * 3.5),    // rises upward
    radius: 3 + Math.random() * 6,
    life: 1.0,
    decay: 0.012 + Math.random() * 0.018, // how fast it fades
    // Colors shift from white-hot core → orange → red as it fades
    hue: 25 + Math.random() * 25,         // yellow-orange range
    wobble: (Math.random() - 0.5) * 0.08,
  });

  const createSmoke = (x, y) => ({
    type: "smoke",
    x: x + (Math.random() - 0.5) * 80,
    y: y - 20 + Math.random() * 20,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -(0.4 + Math.random() * 0.9),    // rises slower
    radius: 10 + Math.random() * 18,
    life: 1.0,
    decay: 0.006 + Math.random() * 0.008, // lingers longer
    expansion: 0.18 + Math.random() * 0.25, // grows as it rises
    wobble: (Math.random() - 0.5) * 0.05,
  });

  // ── Burst Emitter ────────────────────────────────────────────────
  const emitBurst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width;
    const H = canvas.height;

    // Create 6-10 cluster points spread across the viewport
    const clusterCount = 6 + Math.floor(Math.random() * 5);
    for (let c = 0; c < clusterCount; c++) {
      const cx = 0.05 * W + Math.random() * 0.9 * W;
      const cy = 0.1 * H + Math.random() * 0.8 * H;

      // Each cluster: many fire particles + fewer smoke
      const fireCount = 18 + Math.floor(Math.random() * 22);
      const smokeCount = 6 + Math.floor(Math.random() * 8);

      for (let i = 0; i < fireCount; i++) {
        particlesRef.current.push(createFireParticle(cx, cy));
      }
      for (let i = 0; i < smokeCount; i++) {
        particlesRef.current.push(createSmoke(cx, cy));
      }
    }
  }, []);

  // ── Animation Loop ───────────────────────────────────────────────
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    for (const p of particlesRef.current) {
      p.vx += p.wobble;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.type === "fire") {
        // Life goes 1.0 → 0; map to white-hot → orange → deep red
        const lifePct = Math.max(0, p.life);
        // hue: stays orange-yellow, lightness shifts bright→dark
        const lightness = 40 + lifePct * 50; // 90% bright → 40% dark
        const alpha = lifePct * 0.9;
        const r = p.radius * (0.4 + lifePct * 0.6); // shrinks as it fades

        // Outer glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
        grd.addColorStop(0, `hsla(${p.hue}, 100%, ${lightness}%, ${alpha})`);
        grd.addColorStop(0.5, `hsla(${p.hue - 10}, 90%, ${lightness - 20}%, ${alpha * 0.6})`);
        grd.addColorStop(1, `hsla(${p.hue - 20}, 80%, 20%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

      } else {
        // Smoke: expands and fades into gray wisps
        p.radius += p.expansion;
        const alpha = p.life * 0.18;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grd.addColorStop(0, `rgba(80, 70, 65, ${alpha})`);
        grd.addColorStop(0.5, `rgba(60, 55, 50, ${alpha * 0.5})`);
        grd.addColorStop(1, `rgba(40, 35, 30, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
    }

    if (particlesRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      isRunningRef.current = false;
    }
  }, []);

  // ── Canvas Resize ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Lightning Event Listener ─────────────────────────────────────
  useEffect(() => {
    const handleStrike = () => {
      emitBurst();
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("lightning-strike", handleStrike);
    return () => {
      window.removeEventListener("lightning-strike", handleStrike);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [emitBurst, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 10, mixBlendMode: "screen" }}
    />
  );
};

export default BurnEffect;
