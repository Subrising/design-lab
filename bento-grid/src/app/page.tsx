"use client";

import dynamic from "next/dynamic";

const BentoGrid = dynamic(() => import("@/components/BentoGrid"), { ssr: false });

export default function Home() {
  return (
    <main>
      <BentoGrid />
    </main>
  );
}
