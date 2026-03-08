"use client";

import { useEffect, useRef } from "react";

export default function SpotlightReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !maskRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    let rafId: number;
    const animate = () => {
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.12;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.12;

      if (maskRef.current) {
        maskRef.current.style.clipPath = `circle(200px at ${currentPos.current.x}px ${currentPos.current.y}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    section.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={sectionRef} className="spotlight-section">
      {/* Bottom layer: outlined text */}
      <div className="text-layer">
        <p className="text-sm uppercase tracking-[0.4em] text-white/20 mb-4">
          Move your cursor
        </p>
        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-stroke leading-none text-center">
          REVEAL
        </h2>
        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-stroke leading-none text-center">
          THE TEXT
        </h2>
        <p className="mt-8 text-white/10 text-lg max-w-md text-center">
          Hidden beneath the surface lies a world of color and light.
        </p>
      </div>

      {/* Top layer: filled text (clipped by cursor circle) */}
      <div
        ref={maskRef}
        className="text-layer"
        style={{
          clipPath: "circle(200px at -200px -200px)",
          background: "linear-gradient(135deg, #0f0f1a, #1a1030)",
        }}
      >
        <p className="text-sm uppercase tracking-[0.4em] text-indigo-400 mb-4">
          Move your cursor
        </p>
        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter gradient-text leading-none text-center">
          REVEAL
        </h2>
        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter gradient-text leading-none text-center">
          THE TEXT
        </h2>
        <p className="mt-8 text-indigo-300/60 text-lg max-w-md text-center">
          Hidden beneath the surface lies a world of color and light.
        </p>

        {/* Glow ring at cursor */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            left: 0,
            top: 0,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
