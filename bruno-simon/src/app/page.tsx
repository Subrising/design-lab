"use client";

import dynamic from "next/dynamic";

const PlaygroundScene = dynamic(() => import("@/components/PlaygroundScene"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-screen h-screen bg-[#1a1a2e] text-white/60">
      <div className="text-center">
        <div className="text-lg font-medium mb-2">Loading 3D Playground...</div>
        <div className="text-sm text-white/40">Initializing physics engine</div>
      </div>
    </div>
  ),
});

export default function Home() {
  return <PlaygroundScene />;
}
