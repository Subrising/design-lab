"use client";

import dynamic from "next/dynamic";

const ParticleText = dynamic(() => import("@/components/ParticleText"), { ssr: false });

export default function Home() {
  return (
    <main className="w-screen h-screen bg-[#0a0a0a] relative">
      <ParticleText />
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-white/30 text-sm tracking-widest uppercase">
          Click anywhere to destroy &middot; Text reforms automatically
        </p>
      </div>
    </main>
  );
}
