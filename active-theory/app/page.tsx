"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import ProjectShowcase from "./components/ProjectShowcase";
import StatsSection from "./components/StatsSection";
import LabSection from "./components/LabSection";
import Footer from "./components/Footer";

const Scene = dynamic(() => import("./components/Scene"), { ssr: false });

// Section thresholds for particle morphing
const SECTION_THRESHOLDS = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.85, 0.95];

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;
    setScrollProgress(progress);

    // Determine active section based on scroll
    let section = 0;
    for (let i = SECTION_THRESHOLDS.length - 1; i >= 0; i--) {
      if (progress >= SECTION_THRESHOLDS[i]) {
        section = i;
        break;
      }
    }
    setActiveSection(section);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <Scene scrollProgress={scrollProgress} activeSection={activeSection} />

      <div ref={containerRef} className="content-overlay">
        <Navigation scrollProgress={scrollProgress} />
        <HeroSection scrollProgress={scrollProgress} />

        {/* Manifesto Section */}
        <section className="py-32 px-8 flex items-center justify-center">
          <div className="max-w-4xl text-center">
            <p className="text-3xl md:text-5xl font-light leading-relaxed tracking-tight">
              We build{" "}
              <span className="text-accent font-semibold">experiences</span>{" "}
              that exist at the{" "}
              <span className="text-accent font-semibold">intersection</span>{" "}
              of design and technology.
            </p>
            <div className="mt-12 flex items-center justify-center gap-6">
              <div className="h-px w-16 bg-accent/30" />
              <span className="text-xs font-mono text-muted tracking-[0.2em] uppercase">
                Since 2018
              </span>
              <div className="h-px w-16 bg-accent/30" />
            </div>
          </div>
        </section>

        <ProjectShowcase />
        <StatsSection />
        <LabSection />

        {/* CTA Section */}
        <section className="py-40 px-8 text-center">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8">
            Let&apos;s <span className="text-accent">Create</span>
          </h2>
          <p className="text-lg text-muted mb-12 max-w-lg mx-auto">
            Have a project in mind? We&apos;d love to bring your vision to life
            with cutting-edge technology.
          </p>
          <a
            href="mailto:hello@activetheory.net"
            className="inline-flex items-center gap-3 px-8 py-4 border border-accent/40 text-accent text-sm font-mono tracking-[0.1em] uppercase hover:bg-accent/10 hover:border-accent transition-all duration-300 rounded"
          >
            <span>Start a Project</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </section>

        <Footer />
      </div>
    </>
  );
}
