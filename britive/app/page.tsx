"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TextRevealSection from "@/components/TextRevealSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  { ssr: false }
);

export default function Home() {
  return (
    <SmoothScroll>
      <ParticleBackground />
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TextRevealSection />
        <ShowcaseSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
