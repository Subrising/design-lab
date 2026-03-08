"use client";

import { useEffect, useRef, useCallback } from "react";

export default function GlowGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const cellsCache = useRef<{ el: HTMLDivElement; cx: number; cy: number }[]>([]);

  const computeCells = useCallback(() => {
    if (!gridRef.current) return;
    const cells = gridRef.current.querySelectorAll<HTMLDivElement>(".grid-cell");
    cellsCache.current = Array.from(cells).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        el,
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
      };
    });
  }, []);

  useEffect(() => {
    const RADIUS = 150;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const { x, y } = mousePos.current;

      for (const cell of cellsCache.current) {
        const dx = x - cell.cx;
        const dy = y - cell.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS) {
          const intensity = 1 - dist / RADIUS;
          cell.el.style.background = `rgba(99, 102, 241, ${intensity * 0.15})`;
          cell.el.style.borderColor = `rgba(99, 102, 241, ${intensity * 0.3})`;
          cell.el.style.boxShadow = `inset 0 0 ${intensity * 30}px rgba(99, 102, 241, ${intensity * 0.15})`;
        } else {
          cell.el.style.background = "";
          cell.el.style.borderColor = "";
          cell.el.style.boxShadow = "";
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    computeCells();
    window.addEventListener("resize", computeCells);
    document.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", computeCells);
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [computeCells]);

  // Generate enough cells to fill the screen
  const cellCount = 400;

  return (
    <div ref={gridRef} className="glow-grid" aria-hidden="true">
      {Array.from({ length: cellCount }, (_, i) => (
        <div key={i} className="grid-cell" />
      ))}
    </div>
  );
}
