"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ThreeBackground />
      <Navbar />
      <Hero />

      {/* Divider gradient */}
      <div className="relative z-10 h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <BentoGrid />

      <div className="relative z-10 h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Features />

      <div className="relative z-10 h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Testimonials />

      <div className="relative z-10 h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <CTA />
      <Footer />
    </main>
  );
}
