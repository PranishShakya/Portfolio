import React, { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 60 : 125;
    
    // Mouse coords
    const mouse = {
      x: null,
      y: null,
      radius: 140 // Interaction radius
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Particle constructor helper
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.6; // Star size
        
        // Random base velocity
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        
        // Dynamic push velocity
        this.px = 0;
        this.py = 0;
        
        this.opacity = Math.random() * 0.7 + 0.2;
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
        
        // Tailwind amber-400 (yellow-amber) or yellow-300
        this.color = Math.random() > 0.45 ? "rgba(253, 224, 71, " : "rgba(251, 191, 36, "; 
        this.isSparkle = Math.random() < 0.28; // ~28% are sparkles
        this.angle = Math.random() * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.012;
      }

      draw() {
        ctx.fillStyle = `${this.color}${this.opacity})`;
        ctx.shadowBlur = this.size * 3.5;
        ctx.shadowColor = "rgba(253, 224, 71, 0.45)";

        if (this.isSparkle) {
          // Draw 4-point star sparkle shape
          ctx.beginPath();
          const spikes = 4;
          const outerRadius = this.size * 2.8;
          const innerRadius = this.size * 0.5;
          let rot = Math.PI / 2 * 3 + this.angle;
          let cx = this.x;
          let cy = this.y;
          let step = Math.PI / spikes;

          ctx.moveTo(cx, cy - outerRadius);
          for (let i = 0; i < spikes; i++) {
            cx = this.x + Math.cos(rot) * outerRadius;
            cy = this.y + Math.sin(rot) * outerRadius;
            ctx.lineTo(cx, cy);
            rot += step;

            cx = this.x + Math.cos(rot) * innerRadius;
            cy = this.y + Math.sin(rot) * innerRadius;
            ctx.lineTo(cx, cy);
            rot += step;
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Draw standard circular star dot
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0; // Reset shadow for performance
      }

      update() {
        // Soft twinkle fluctuation
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        if (this.opacity >= 0.95) {
          this.opacity = 0.95;
          this.twinkleDirection = -1;
        } else if (this.opacity <= 0.15) {
          this.opacity = 0.15;
          this.twinkleDirection = 1;
        }

        // Sparkle rotation
        if (this.isSparkle) {
          this.angle += this.rotationSpeed;
        }

        // Handle mouse interaction (repulsion)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            // Push force: stronger closer to mouse
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            
            // Push vector
            const pushX = Math.cos(angle) * force * 1.8;
            const pushY = Math.sin(angle) * force * 1.8;
            
            // Smoothly interpolate to push target
            this.px += (pushX - this.px) * 0.12;
            this.py += (pushY - this.py) * 0.12;
          } else {
            // Friction: fade push velocity slowly back to 0
            this.px *= 0.94;
            this.py *= 0.94;
          }
        } else {
          this.px *= 0.94;
          this.py *= 0.94;
        }

        // Apply total velocity
        this.x += this.vx + this.px;
        this.y += this.vy + this.py;

        // Wrap around boundaries
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Optionally draw lines between close particles (glowing constellation)
      connectParticles();

      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = () => {
      const maxDistance = 90;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Faded constellation lines (using yellow/amber accent color)
            const alpha = (maxDistance - distance) / maxDistance * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(253, 224, 71, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
    };

    // Event listeners
    window.addEventListener("resize", resizeCanvas);
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Run setup
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default ParticleBackground;
