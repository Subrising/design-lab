"use client";

import dynamic from "next/dynamic";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const ParticleField = dynamic(() => import("@/components/ParticleField"), { ssr: false });
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: false });
const ProductSection = dynamic(() => import("@/components/ProductSection"), { ssr: false });
const SpecsSection = dynamic(() => import("@/components/SpecsSection"), { ssr: false });
const GallerySection = dynamic(() => import("@/components/GallerySection"), { ssr: false });
const CtaSection = dynamic(() => import("@/components/CtaSection"), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <div className="scanlines cyber-grid">
        <ParticleField />
        <HeroSection />
        <ProductSection />
        <SpecsSection />
        <GallerySection />
        <CtaSection />
      </div>
    </SmoothScroll>
  );
}
