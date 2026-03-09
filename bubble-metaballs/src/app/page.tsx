"use client";

import dynamic from "next/dynamic";

const MetaballScene = dynamic(() => import("@/components/MetaballScene"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative w-screen h-screen bg-[#050510]">
      <MetaballScene />
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
        <h1 className="text-white/80 text-5xl font-light tracking-tight leading-tight">
          Bubble
          <br />
          <span className="text-white/40">Metaballs</span>
        </h1>
        <p className="text-white/25 text-sm mt-3 font-light tracking-wide">
          GLSL Raymarching &middot; SDF Smooth-Min &middot; Fresnel
        </p>
      </div>
    </main>
  );
}
