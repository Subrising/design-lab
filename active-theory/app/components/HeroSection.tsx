"use client";

import { useEffect, useRef } from "react";

interface HeroSectionProps {
  scrollProgress: number;
}

export default function HeroSection({ scrollProgress }: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div
        className="text-center relative"
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 3),
          transform: `translateY(${scrollProgress * -100}px)`,
        }}
      >
        {/* Tagline */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-accent/40" />
          <span className="text-xs font-mono tracking-[0.3em] text-accent/70 uppercase">
            Digital Experience Studio
          </span>
          <div className="h-px w-12 bg-accent/40" />
        </div>

        {/* Main title — particles form this text in the background */}
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9]"
        >
          <span className="block text-fg">ACTIVE</span>
          <span className="block text-accent">THEORY</span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-muted max-w-xl mx-auto leading-relaxed">
          Crafting immersive digital experiences through the intersection of
          design, technology, and creativity.
        </p>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <span className="text-[10px] font-mono tracking-[0.3em] text-muted uppercase">
            Scroll to explore
          </span>
          <div className="w-px h-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
