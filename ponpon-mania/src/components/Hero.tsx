"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ delay: 0.5 });

    // Main title animation
    tl.fromTo(
      ".hero-title-line",
      { y: "110%", skewY: 7 },
      {
        y: "0%",
        skewY: 0,
        duration: 1.4,
        stagger: 0.12,
        ease: "expo.out",
      }
    );

    // Subtitle fade
    tl.fromTo(
      ".hero-subtitle",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );

    // Scroll indicator
    tl.fromTo(
      ".scroll-indicator",
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      "-=0.3"
    );

    // Continuous bounce on scroll indicator
    gsap.to(".scroll-indicator-arrow", {
      y: 8,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative px-8"
      style={{ zIndex: 1 }}
    >
      <div className="text-center">
        <div className="overflow-hidden mb-2">
          <p
            className="hero-subtitle text-[#f1abbd] text-sm md:text-base tracking-[0.5em] uppercase"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            An Interactive Comic Experience
          </p>
        </div>

        <div className="overflow-hidden">
          <h1
            className="hero-title-line text-[#171717] text-7xl md:text-9xl lg:text-[12rem] font-black leading-[0.85] tracking-tighter"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            PONPON
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1
            className="hero-title-line text-[#171717] text-7xl md:text-9xl lg:text-[12rem] font-black leading-[0.85] tracking-tighter"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            MANIA
          </h1>
        </div>

        <div className="overflow-hidden mt-6">
          <p
            className="hero-subtitle text-[#171717]/60 text-base md:text-lg max-w-md mx-auto"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            The megalomaniac sheep who dreams of becoming a DJ
          </p>
        </div>
      </div>

      <div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span
          className="text-[#171717]/40 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Libre Franklin', sans-serif" }}
        >
          Scroll to explore
        </span>
        <div className="scroll-indicator-arrow w-[1px] h-8 bg-[#171717]/20 relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b border-[#171717]/30 rotate-45 -mb-1" />
        </div>
      </div>
    </div>
  );
}
