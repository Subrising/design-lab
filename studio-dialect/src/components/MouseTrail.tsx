"use client";

import { useEffect, useRef } from "react";

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const trail: { x: number; y: number; age: number }[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let frame = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      trail.push({ x: mouseX, y: mouseY, age: 0 });
      if (trail.length > 50) trail.shift();
    };

    const animate = () => {
      frame = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age++;
        if (trail[i].age > 30) {
          trail.splice(i, 1);
          continue;
        }
      }

      if (trail.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length; i++) {
        const p = trail[i];
        const alpha = 1 - p.age / 30;
        ctx.strokeStyle = `rgba(200, 255, 0, ${alpha * 0.15})`;
        ctx.lineWidth = (1 - p.age / 30) * 2;
        ctx.lineTo(p.x, p.y);
      }

      ctx.stroke();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9990]"
    />
  );
}
