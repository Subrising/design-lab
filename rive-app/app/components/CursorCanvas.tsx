"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface OrbitNode {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
}

export default function CursorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const nodesRef = useRef<OrbitNode[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#7b61ff", "#ff6b9d", "#00d4aa", "#ffb347", "#9b7dff"];

    // Create orbit nodes
    for (let i = 0; i < 8; i++) {
      nodesRef.current.push({
        angle: (Math.PI * 2 * i) / 8,
        radius: 80 + Math.random() * 120,
        speed: 0.003 + Math.random() * 0.008,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Spawn particles on mouse move
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          radius: 1 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 0,
          maxLife: 40 + Math.random() * 40,
        });
      }
    };

    canvas.addEventListener("mousemove", onMouseMove);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    let animId: number;
    const animate = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, w(), h());

      const mx = mouseRef.current.x || w() / 2;
      const my = mouseRef.current.y || h() / 2;

      // Draw connection lines between nearby nodes
      const allPositions: { x: number; y: number; color: string }[] = [];

      // Update and draw orbit nodes
      nodesRef.current.forEach((node) => {
        node.angle += node.speed;
        const nx = mx + Math.cos(node.angle) * node.radius;
        const ny = my + Math.sin(node.angle) * node.radius;

        // Add to trail
        node.trail.push({ x: nx, y: ny, alpha: 1 });
        if (node.trail.length > 20) node.trail.shift();

        // Draw trail
        node.trail.forEach((t, i) => {
          t.alpha *= 0.92;
          ctx.beginPath();
          ctx.arc(t.x, t.y, node.size * t.alpha * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = node.color + Math.floor(t.alpha * 40).toString(16).padStart(2, "0");
          ctx.fill();
        });

        // Draw node
        ctx.beginPath();
        ctx.arc(nx, ny, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(nx, ny, node.size * 3, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.size * 3);
        glow.addColorStop(0, node.color + "40");
        glow.addColorStop(1, node.color + "00");
        ctx.fillStyle = glow;
        ctx.fill();

        allPositions.push({ x: nx, y: ny, color: node.color });
      });

      // Connection lines
      for (let i = 0; i < allPositions.length; i++) {
        for (let j = i + 1; j < allPositions.length; j++) {
          const dx = allPositions[i].x - allPositions[j].x;
          const dy = allPositions[i].y - allPositions[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.3;
            ctx.beginPath();
            ctx.moveTo(allPositions[i].x, allPositions[i].y);
            ctx.lineTo(allPositions[j].x, allPositions[j].y);
            ctx.strokeStyle = `rgba(123, 97, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Lines from cursor to nodes
      allPositions.forEach((pos) => {
        const dx = mx - pos.x;
        const dy = my - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          const alpha = (1 - dist / 250) * 0.15;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(pos.x, pos.y);
          ctx.strokeStyle = `rgba(255, 107, 157, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha = 1 - p.life / p.maxLife;

        if (p.life >= p.maxLife) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
        return true;
      });

      // Central glow at cursor
      const centerGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
      centerGlow.addColorStop(0, "rgba(123, 97, 255, 0.15)");
      centerGlow.addColorStop(0.5, "rgba(255, 107, 157, 0.05)");
      centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(mx, my, 60, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "all" }}
    />
  );
}
