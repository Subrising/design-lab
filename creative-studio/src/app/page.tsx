"use client";

import dynamic from "next/dynamic";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const ParticleBg = dynamic(() => import("@/components/ParticleBg"), { ssr: false });
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: false });
const MarqueeStrip = dynamic(() => import("@/components/MarqueeStrip"), { ssr: false });
const CaseStudies = dynamic(() => import("@/components/CaseStudies"), { ssr: false });
const ServicesSection = dynamic(() => import("@/components/ServicesSection"), { ssr: false });
const AboutSection = dynamic(() => import("@/components/AboutSection"), { ssr: false });
const ContactSection = dynamic(() => import("@/components/ContactSection"), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <div className="grain">
        <ParticleBg />
        <CustomCursor />
        <HeroSection />
        <MarqueeStrip />
        <CaseStudies />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </div>
    </SmoothScroll>
  );
}
