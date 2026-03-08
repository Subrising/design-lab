"use client";

import dynamic from "next/dynamic";

const StarField = dynamic(() => import("@/components/StarField"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false });
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: false });
const ParallaxLayers = dynamic(() => import("@/components/ParallaxLayers"), { ssr: false });
const PinnedReveal = dynamic(() => import("@/components/PinnedReveal"), { ssr: false });
const HorizontalScroll = dynamic(() => import("@/components/HorizontalScroll"), { ssr: false });
const CounterSection = dynamic(() => import("@/components/CounterSection"), { ssr: false });
const FinaleSection = dynamic(() => import("@/components/FinaleSection"), { ssr: false });

export default function Home() {
  return (
    <main className="relative">
      <StarField />
      <ScrollProgress />
      <HeroSection />
      <ParallaxLayers />
      <PinnedReveal />
      <HorizontalScroll />
      <CounterSection />
      <FinaleSection />
    </main>
  );
}
