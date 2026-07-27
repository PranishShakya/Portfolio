import React, { useEffect, useRef, useCallback } from "react";

/**
 * StrikeFire — Canvas-based fire, ember, shockwave & smoke particle system.
 * Listens for the "lightning-strike" custom DOM event with { detail: { x, y } }
 * and erupts a dramatic fire column + shockwave ring at the bolt's ground impact.
 * Designed to work visually on both dark AND light backgrounds (no screen blend).
 */
const BurnEffect = () => {
  const canvasRef   = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const isRunningRef = useRef(false);

  // ── Particle Factories ───────────────────────────────────────────

  const createFire = (x, y) => ({
    type: "fire",
    x: x + (Math.random() - 0.5) * 55,
    y: y + Math.random() * 20,
    vx: (Math.random() - 0.5) * 2.5,
    vy: -(2.5 + Math.random() * 5.5),   // rises fast
    radius: 5 + Math.random() * 10,
    life: 1.0,
    decay: 0.014 + Math.random() * 0.016,
    hue: 15 + Math.random() * 30,        // white-hot → orange-red
    wobble: (Math.random() - 0.5) * 0.12,
  });

  const createEmber = (x, y) => ({
    type: "ember",
    x: x + (Math.random() - 0.5) * 40,
    y: y + Math.random() * 10,
    vx: (Math.random() - 0.5) * 5,
    vy: -(3 + Math.random() * 7),
    radius: 1.5 + Math.random() * 3,
    life: 1.0,
    decay: 0.018 + Math.random() * 0.025,
    hue: 20 + Math.random() * 20,
    gravity: 0.12 + Math.random() * 0.1, // falls back down
    wobble: (Math.random() - 0.5) * 0.2,
  });

  const createSmoke = (x, y) => ({
    type: "smoke",
    x: x + (Math.random() - 0.5) * 70,
    y: y - 30 + Math.random() * 25,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -(0.5 + Math.random() * 1.0),
    radius: 12 + Math.random() * 20,
    life: 1.0,
    decay: 0.005 + Math.random() * 0.007,
    expansion: 0.2 + Math.random() * 0.3,
    wobble: (Math.random() - 0.5) * 0.06,
  });

  const createShockwave = (x, y) => ({
    type: "shockwave",
    x, y,
    radius: 5,
    maxRadius: 110 + Math.random() * 80,
    life: 1.0,
    decay: 0.035,
    growSpeed: 12 + Math.random() * 8,
  });

  // ── Burst Emitter — fires at exact bolt impact position ──────────
  const emitBurst = useCallback((impactX, impactY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width;
    const H = canvas.height;

    // Clamp impact to canvas bounds
    const cx = Math.min(Math.max(impactX, 30), W - 30);
    const cy = Math.min(Math.max(impactY, 30), H - 30);

    // 1. Shockwave ring at ground impact point
    particlesRef.current.push(createShockwave(cx, cy));
    particlesRef.current.push(createShockwave(cx, cy - 15)); // double ring

    // 2. Primary fire column (tight cluster at impact)
    for (let i = 0; i < 45; i++) {
      particlesRef.current.push(createFire(cx, cy));
    }

    // 3. Flying ember sparks scattered outward
    for (let i = 0; i < 30; i++) {
      particlesRef.current.push(createEmber(cx, cy));
    }

    // 4. Secondary fire clusters splattered around
    const splatterCount = 3 + Math.floor(Math.random() * 4);
    for (let s = 0; s < splatterCount; s++) {
      const sx = cx + (Math.random() - 0.5) * 200;
      const sy = cy + (Math.random() - 0.5) * 120;
      for (let i = 0; i < 18; i++) particlesRef.current.push(createFire(sx, sy));
      for (let i = 0; i < 8;  i++) particlesRef.current.push(createEmber(sx, sy));
    }

    // 5. Smoke columns that linger
    for (let i = 0; i < 14; i++) {
      particlesRef.current.push(createSmoke(cx, cy));
    }
  }, []);

  // ── Animation Loop ────────────────────────────────────────────────
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    for (const p of particlesRef.current) {
      p.life -= p.decay;
      if (p.life <= 0) continue;

      if (p.type === "shockwave") {
        p.radius += p.growSpeed;
        p.growSpeed *= 0.88; // decelerate expansion
        const alpha = p.life * 0.7;
        const lineW  = Math.max(0.5, p.life * 4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 160, 40, ${alpha})`;
        ctx.lineWidth = lineW;
        ctx.stroke();
        // inner glow ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 220, 80, ${alpha * 0.5})`;
        ctx.lineWidth = lineW * 0.5;
        ctx.stroke();

      } else if (p.type === "fire") {
        p.vx += p.wobble;
        p.x  += p.vx;
        p.y  += p.vy;

        const lifePct  = Math.max(0, p.life);
        const lightness = 42 + lifePct * 52;
        const alpha     = lifePct * 0.95;
        const r         = p.radius * (0.35 + lifePct * 0.65);

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        grd.addColorStop(0,   `hsla(${p.hue + 15}, 100%, ${lightness + 10}%, ${alpha})`);
        grd.addColorStop(0.4, `hsla(${p.hue},      100%, ${lightness}%,      ${alpha * 0.75})`);
        grd.addColorStop(0.8, `hsla(${p.hue - 10},  90%, ${lightness - 20}%, ${alpha * 0.35})`);
        grd.addColorStop(1,   `hsla(${p.hue - 20},  80%, 20%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

      } else if (p.type === "ember") {
        p.vy += p.gravity;  // gravity pulls embers back down
        p.vx += p.wobble;
        p.x  += p.vx;
        p.y  += p.vy;

        const alpha = p.life * 0.95;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        grd.addColorStop(0, `hsla(${p.hue + 20}, 100%, 90%, ${alpha})`);
        grd.addColorStop(1, `hsla(${p.hue},      100%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // ember trail glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(50, 100%, 95%, ${alpha})`;
        ctx.fill();

      } else if (p.type === "smoke") {
        p.vx += p.wobble;
        p.x  += p.vx;
        p.y  += p.vy;
        p.radius += p.expansion;

        const alpha = p.life * 0.22;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grd.addColorStop(0,   `rgba(90, 75, 65, ${alpha})`);
        grd.addColorStop(0.5, `rgba(65, 55, 50, ${alpha * 0.55})`);
        grd.addColorStop(1,   `rgba(40, 35, 30, 0)`);

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

  // ── Canvas Resize ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Lightning Event Listener ──────────────────────────────────────
  useEffect(() => {
    const handleStrike = (e) => {
      // Get impact position from event detail; fallback to random position
      const canvas = canvasRef.current;
      const W = canvas ? canvas.width  : window.innerWidth;
      const H = canvas ? canvas.height : window.innerHeight;
      const x = e.detail?.x ?? 0.3 * W + Math.random() * 0.4 * W;
      const y = e.detail?.y ?? 0.5 * H + Math.random() * 0.4 * H;

      emitBurst(x, y);

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
      style={{ zIndex: 46 }}   // sits above lightning bolt z-45
    />
  );
};

export default BurnEffect;
