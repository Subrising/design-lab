"use client";

import dynamic from "next/dynamic";

const VoxelScene = dynamic(() => import("@/components/VoxelScene"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-screen h-screen bg-[#0a0a0a] text-white/60">
      <div className="text-center">
        <div className="text-lg font-medium mb-2">Loading Physics Engine...</div>
        <div className="text-sm text-white/40">Initializing Rapier WASM</div>
      </div>
    </div>
  ),
});

export default function Home() {
  return <VoxelScene />;
}
