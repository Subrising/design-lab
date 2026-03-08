"use client";

import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import LogoCloud from "@/components/LogoCloud";
import Features from "@/components/Features";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import ProductShowcase from "@/components/ProductShowcase";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <LogoCloud />
      <Features />
      <KeyboardShortcuts />
      <ProductShowcase />
      <CTA />
      <Footer />
    </main>
  );
}
