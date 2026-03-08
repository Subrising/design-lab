"use client";

import dynamic from "next/dynamic";

const LiquidGlass = dynamic(() => import("@/components/LiquidGlass"), { ssr: false });

export default function Home() {
  return (
    <main>
      <LiquidGlass />
    </main>
  );
}
