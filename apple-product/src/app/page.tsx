"use client";

import dynamic from "next/dynamic";
import AppleNav from "@/components/AppleNav";
import StickyHeroParallax from "@/components/StickyHeroParallax";
import SpecReveals from "@/components/SpecReveals";
import AppleFooter from "@/components/AppleFooter";

const ScrollVideoScrub = dynamic(() => import("@/components/ScrollVideoScrub"), {
  ssr: false,
});

const ProductRotation3D = dynamic(() => import("@/components/ProductRotation3D"), {
  ssr: false,
});

const ColorPicker = dynamic(() => import("@/components/ColorPicker"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <AppleNav />

      {/* Hero section with sticky parallax */}
      <section style={{ paddingTop: "44px" }}>
        <StickyHeroParallax />
      </section>

      {/* Scroll video scrub section */}
      <section className="section-divider" />
      <ScrollVideoScrub />

      {/* 3D Product rotation */}
      <section className="section-divider" />
      <ProductRotation3D />

      {/* Color picker */}
      <section className="section-divider" />
      <ColorPicker />

      {/* Spec reveals with counters */}
      <section className="section-divider" />
      <SpecReveals />

      {/* Final CTA & Footer */}
      <AppleFooter />
    </main>
  );
}
