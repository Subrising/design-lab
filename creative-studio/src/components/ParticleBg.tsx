"use client";

import { useEffect, useRef } from "react";

export default function ParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const particles: { x: number; y: number; baseX: number; baseY: number; size: number; speed: number }[] = [];
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x, y, baseX: x, baseY: y,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      particles.forEach((p) => {
        // Gentle float
        p.x = p.baseX + Math.sin(time + p.baseX * 0.01) * 30;
        p.y = p.baseY + Math.cos(time + p.baseY * 0.01) * 20;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.x += (dx / dist) * force * 30;
          p.y += (dy / dist) * force * 30;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200, 255, 0, 0.15)";
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(200, 255, 0, ${0.04 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="canvas-bg" />;
}
