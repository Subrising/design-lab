"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import ParticleCanvas from "@/components/ParticleCanvas";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import SpeedSection from "@/components/SpeedSection";
import MotionPathSection from "@/components/MotionPathSection";
import HorizontalScroll from "@/components/HorizontalScroll";
import PinnedGallery from "@/components/PinnedGallery";
import TimelineSection from "@/components/TimelineSection";
import FooterSection from "@/components/FooterSection";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Home() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main className="relative bg-carbon grid-overlay">
      <ParticleCanvas />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <SpeedSection />
      <MotionPathSection />
      <HorizontalScroll />
      <PinnedGallery />
      <TimelineSection />
      <FooterSection />
    </main>
  );
}
