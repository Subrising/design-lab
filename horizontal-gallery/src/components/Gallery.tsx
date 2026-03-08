"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Card3D from "./Card3D";

const projects = [
  {
    title: "Aurora",
    subtitle: "Visual Design",
    description: "An ambient light experience using WebGL shaders and real-time noise generation.",
    gradientClass: "card-gradient-1",
    tags: ["WebGL", "GLSL", "Three.js"],
  },
  {
    title: "Cascade",
    subtitle: "Data Viz",
    description: "Flowing data visualization inspired by waterfall charts, with live streaming data.",
    gradientClass: "card-gradient-2",
    tags: ["D3.js", "WebSocket", "SVG"],
  },
  {
    title: "Terraform",
    subtitle: "Generative Art",
    description: "Procedurally generated landscapes using Perlin noise and erosion simulation.",
    gradientClass: "card-gradient-3",
    tags: ["Canvas", "Perlin", "Procedural"],
  },
  {
    title: "Helios",
    subtitle: "Brand Identity",
    description: "Solar-themed brand system with dynamic color palettes derived from time of day.",
    gradientClass: "card-gradient-4",
    tags: ["Design System", "CSS", "Tokens"],
  },
  {
    title: "Pulse",
    subtitle: "Audio Visual",
    description: "Real-time audio-reactive visualizations using Web Audio API and WebGL particles.",
    gradientClass: "card-gradient-5",
    tags: ["Web Audio", "Particles", "FFT"],
  },
  {
    title: "Verdant",
    subtitle: "Environmental",
    description: "Interactive climate data explorer showing global temperature trends across decades.",
    gradientClass: "card-gradient-6",
    tags: ["MapboxGL", "GeoJSON", "React"],
  },
];

export default function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    const idx = Math.round(progress * (projects.length - 1));
    setActiveIndex(idx);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", handleScroll);
    return () => track.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Wheel → horizontal scroll conversion
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      track.scrollBy({ left: e.deltaY * 2, behavior: "smooth" });
    };

    track.addEventListener("wheel", handleWheel, { passive: false });
    return () => track.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <div className="text-lg font-bold tracking-tight">
          Gallery<span className="text-indigo-400">.</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs text-white/30 uppercase tracking-widest font-mono">
            {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Active project title (background) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[15vw] font-bold tracking-tighter text-white/[0.02] select-none">
            {projects[activeIndex].title}
          </h1>
        </motion.div>
      </AnimatePresence>

      {/* Gallery track */}
      <div ref={trackRef} className="gallery-track">
        {projects.map((project, i) => (
          <Card3D key={i} {...project} index={i} />
        ))}
      </div>

      {/* Scroll indicator dots */}
      <div className="scroll-indicator">
        {projects.map((_, i) => (
          <div
            key={i}
            className={`scroll-dot ${i === activeIndex ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <motion.div
        className="fixed bottom-12 right-8 text-xs text-white/20 uppercase tracking-widest flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span>Scroll or drag</span>
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-white/20">
          <path d="M0 6h18M12 1l6 5-6 5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </motion.div>
    </div>
  );
}
