"use client";

import SmoothScroll from "@/components/SmoothScroll";
import CursorGlow from "@/components/CursorGlow";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Showcase from "@/components/Showcase";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      {/* Background effects */}
      <div className="gradient-mesh" />
      <div className="noise-overlay" />
      <CursorGlow />

      {/* Content */}
      <main className="relative z-10">
        <Hero />
        <Features />
        <Showcase />
        <Testimonials />
        <CTA />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
