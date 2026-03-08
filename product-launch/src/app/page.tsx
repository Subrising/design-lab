"use client";

import dynamic from "next/dynamic";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false });
const Navigation = dynamic(() => import("@/components/Navigation"), { ssr: false });
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: false });
const ProductReveal = dynamic(() => import("@/components/ProductReveal"), { ssr: false });
const FeatureShowcase = dynamic(() => import("@/components/FeatureShowcase"), { ssr: false });
const SpecsCounter = dynamic(() => import("@/components/SpecsCounter"), { ssr: false });
const ColorSection = dynamic(() => import("@/components/ColorSection"), { ssr: false });
const LightSection = dynamic(() => import("@/components/LightSection"), { ssr: false });
const CtaSection = dynamic(() => import("@/components/CtaSection"), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <div className="noise-overlay">
        <ScrollProgress />
        <Navigation />
        <HeroSection />
        <ProductReveal />
        <FeatureShowcase />
        <SpecsCounter />
        <ColorSection />
        <LightSection />
        <CtaSection />
      </div>
    </SmoothScroll>
  );
}
