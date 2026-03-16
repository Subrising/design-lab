"use client";

import dynamic from "next/dynamic";

const ProgressDemo = dynamic(() => import("@/components/ProgressDemo"), { ssr: false });

export default function Home() {
  return (
    <main>
      <ProgressDemo />
    </main>
  );
}
