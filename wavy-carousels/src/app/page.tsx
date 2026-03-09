"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <Scene />

      {/* Top gradient fade */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10" />

      {/* Bottom gradient fade */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />

      {/* Title overlay */}
      <div className="fixed bottom-8 left-8 z-20 pointer-events-none">
        <h1 className="text-sm font-light tracking-[0.3em] uppercase text-white/40">
          Wavy Carousels
        </h1>
      </div>

      {/* Scroll hint */}
      <div className="fixed bottom-8 right-8 z-20 pointer-events-none">
        <p className="text-xs tracking-widest uppercase text-white/20">
          Scroll or drag
        </p>
      </div>
    </main>
  );
}
