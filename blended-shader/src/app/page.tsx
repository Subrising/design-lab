"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Header */}
      <div className="absolute top-6 left-8 z-10 pointer-events-none select-none">
        <h1 className="text-lg font-light tracking-[0.2em] uppercase text-white/80">
          Blended Shader
        </h1>
        <p className="text-xs font-mono text-white/30 mt-1 tracking-wider">
          GLSL Material Transitions
        </p>
      </div>

      {/* Instructions */}
      <div className="absolute top-6 right-8 z-10 pointer-events-none select-none">
        <p className="text-[10px] font-mono text-white/25 text-right leading-relaxed">
          Move mouse to blend materials
          <br />
          Top-left: Metallic
          <br />
          Top-right: Glass
          <br />
          Bottom: Organic
        </p>
      </div>

      <Scene />
    </main>
  );
}
