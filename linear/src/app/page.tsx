"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import Integrations from "@/components/Integrations";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <KeyboardShortcuts />
      <Integrations />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
