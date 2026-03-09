"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

const SECTIONS = ["Home", "About", "Work", "Services", "Contact"];

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / maxScroll, 1);
      setScrollProgress(progress);
      setActiveSection(Math.min(Math.floor(progress * SECTIONS.length), SECTIONS.length - 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="scroll-container" />

      <div className="canvas-wrapper">
        <Scene scrollProgress={scrollProgress} activeSection={activeSection} />
      </div>

      <div className="overlay-ui" ref={overlayRef}>
        <div
          className="text-center transition-opacity duration-700"
          style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
        >
          <h1 className="text-6xl md:text-8xl font-extralight tracking-[0.2em] text-white/90 mb-4">
            IGLOO
          </h1>
          <p className="text-sm md:text-base tracking-[0.5em] text-emerald-300/70 uppercase">
            Digital Experiences
          </p>
          <div className="mt-12 animate-bounce text-white/30 text-xs tracking-widest">
            SCROLL
          </div>
        </div>
      </div>

      <div className="section-indicator">
        {SECTIONS.map((s, i) => (
          <div
            key={s}
            className={`section-dot ${i === activeSection ? "active" : ""}`}
            title={s}
          />
        ))}
      </div>

      <nav className="fixed top-0 left-0 w-full z-20 flex justify-between items-center px-8 py-6 pointer-events-none">
        <span className="text-xs tracking-[0.3em] text-white/50 font-light pointer-events-auto cursor-pointer hover:text-white/90 transition-colors">
          IGLOO INC
        </span>
        <div className="flex gap-8 pointer-events-auto">
          {SECTIONS.map((s) => (
            <span
              key={s}
              className="text-xs tracking-widest text-white/30 cursor-pointer hover:text-emerald-300/80 transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </nav>
    </>
  );
}
