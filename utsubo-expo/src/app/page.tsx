"use client";

import { useEffect, useRef } from "react";
import { initScene } from "./scene";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanup = initScene(containerRef.current);
    return cleanup;
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#020208]">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none select-none">
        <h1 className="text-white/60 text-xs font-medium tracking-[0.3em] uppercase mb-1">
          utsubo-expo
        </h1>
        <p className="text-white/30 text-[10px] tracking-[0.15em] uppercase">
          Fluid Particle Simulation
        </p>
      </div>
      <div className="absolute top-8 right-8 z-10 pointer-events-none select-none">
        <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase">
          Move mouse to interact
        </p>
      </div>
    </div>
  );
}
