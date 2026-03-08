"use client";

import dynamic from "next/dynamic";

const Gallery = dynamic(() => import("@/components/Gallery"), { ssr: false });

export default function Home() {
  return (
    <main className="relative h-screen overflow-hidden">
      <Gallery />
    </main>
  );
}
