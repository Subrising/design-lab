"use client";

import dynamic from "next/dynamic";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const ProgressNav = dynamic(() => import("@/components/ProgressNav"), { ssr: false });
const PrologueSection = dynamic(() => import("@/components/PrologueSection"), { ssr: false });
const Chapter1 = dynamic(() => import("@/components/Chapter1"), { ssr: false });
const Chapter2 = dynamic(() => import("@/components/Chapter2"), { ssr: false });
const Chapter3 = dynamic(() => import("@/components/Chapter3"), { ssr: false });
const EpilogueSection = dynamic(() => import("@/components/EpilogueSection"), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <div className="noise cinema-bars">
        <ProgressNav />
        <PrologueSection />
        <Chapter1 />
        <Chapter2 />
        <Chapter3 />
        <EpilogueSection />
      </div>
    </SmoothScroll>
  );
}
