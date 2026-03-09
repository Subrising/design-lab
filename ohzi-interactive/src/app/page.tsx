"use client";

import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";
import ServicesSection from "@/components/ServicesSection";
import LabsSection from "@/components/LabsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import CustomCursor from "@/components/CustomCursor";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="relative bg-[#020208] min-h-screen">
      <Scene />
      <CustomCursor />
      <Navigation />

      <div className="relative z-10">
        <HeroSection />
        <WorkSection />
        <ServicesSection />
        <LabsSection />
        <AboutSection />
        <ContactSection />
      </div>
    </main>
  );
}
