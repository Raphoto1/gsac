"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface ParticleNetworkProps {
  /** Number of particles (default: 70) */
  count?: number;
  /** Max distance between particles to draw a connection (default: 130) */
  maxDistance?: number;
  /** Particle radius range: [min, max] (default: [1, 3]) */
  radiusRange?: [number, number];
  /** Max speed of each particle (default: 0.6) */
  speed?: number;
  /** RGB values of the particle/line color, e.g. "99,102,241" (default: "99,102,241") */
  color?: string;
  /** Opacity of dots (default: 0.55) */
  dotOpacity?: number;
  /** Max opacity of connection lines (default: 0.4) */
  lineOpacity?: number;
  /** Extra CSS classes for the canvas element */
  className?: string;
}

export default function ParticleNetwork({
  count = 70,
  maxDistance = 130,
  radiusRange = [1, 3],
  speed = 0.6,
  color = "99,102,241",
  dotOpacity = 0.55,
  lineOpacity = 0.4,
  className = "",
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const [rMin, rMax] = radiusRange;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * (rMax - rMin) + rMin,
    }));

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${color},${(1 - dist / maxDistance) * lineOpacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${dotOpacity})`;
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [count, maxDistance, radiusRange, speed, color, dotOpacity, lineOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
