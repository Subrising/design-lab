"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const GommageScene = dynamic(() => import("./components/GommageScene"), {
  ssr: false,
});

export default function Home() {
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-screen h-screen bg-[#0a0a0a] overflow-hidden">
      <GommageScene />

      {/* UI Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="text-xs tracking-[0.3em] uppercase text-white/40 font-light"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Gommage Effect
            </h1>
            <p className="text-[10px] tracking-[0.15em] uppercase text-white/20 mt-1">
              MSDF Text Dissolution
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-[0.15em] uppercase text-white/20">
              Three.js + GLSL
            </p>
          </div>
        </div>

        {/* Center hint */}
        <div
          className={`flex justify-center transition-opacity duration-1000 ${
            showHint ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 text-white/30 text-xs tracking-widest uppercase">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="animate-pulse"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" />
              <circle cx="8" cy="8" r="2" fill="currentColor" />
            </svg>
            Click anywhere to dissolve
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end">
          <p className="text-[10px] tracking-[0.15em] uppercase text-white/15">
            Perlin noise dissolve &middot; Instanced particles &middot; Bloom
          </p>
          <p className="text-[10px] tracking-[0.15em] uppercase text-white/15">
            Inspired by Codrops
          </p>
        </div>
      </div>
    </main>
  );
}
