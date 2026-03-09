"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function HeroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.from(".hero-line-1", {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    })
      .from(
        ".hero-line-2",
        { y: 40, opacity: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      )
      .from(
        ".hero-cta",
        { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > window.innerHeight * 0.3) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-20 pointer-events-none flex flex-col items-center justify-end pb-24 transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="text-center">
        <h1 className="hero-line-1 text-6xl lg:text-8xl font-extralight tracking-tight text-glow mb-4">
          D2C <span className="font-light">Life Science</span>
        </h1>
        <p className="hero-line-2 text-lg lg:text-xl text-white/50 font-light tracking-widest uppercase">
          Precision meets innovation
        </p>
        <div className="hero-cta mt-12 flex flex-col items-center gap-3">
          <p className="text-xs text-white/30 tracking-[0.2em] uppercase">
            Scroll to explore
          </p>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
