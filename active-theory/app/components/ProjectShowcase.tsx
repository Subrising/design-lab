"use client";

import { useRef, useEffect, useState } from "react";

interface Project {
  title: string;
  category: string;
  description: string;
  tech: string[];
  year: string;
}

const projects: Project[] = [
  {
    title: "Particle Genesis",
    category: "Interactive Experience",
    description: "Real-time particle simulation with 50K particles forming organic structures through GPU-accelerated physics.",
    tech: ["WebGL", "GLSL", "Three.js"],
    year: "2026",
  },
  {
    title: "Neural Canvas",
    category: "Generative Art",
    description: "AI-driven generative artwork that responds to audio input and creates evolving visual compositions.",
    tech: ["WebGPU", "TensorFlow.js", "Web Audio"],
    year: "2026",
  },
  {
    title: "Fluid Dynamics",
    category: "Simulation",
    description: "High-fidelity fluid simulation using Navier-Stokes equations rendered with instanced meshes.",
    tech: ["React Three Fiber", "GPGPU", "Instancing"],
    year: "2025",
  },
  {
    title: "Morphic Typography",
    category: "Typography",
    description: "3D text that morphs between typefaces using vertex interpolation and signed distance fields.",
    tech: ["SDF", "Custom Shaders", "GSAP"],
    year: "2025",
  },
  {
    title: "Data Cosmos",
    category: "Data Visualization",
    description: "Immersive 3D data visualization exploring interconnected datasets as navigable cosmic structures.",
    tech: ["D3.js", "Three.js", "Force Graph"],
    year: "2025",
  },
  {
    title: "Sonic Landscape",
    category: "Audio Reactive",
    description: "Terrain generated from audio analysis, with real-time displacement mapping and bloom effects.",
    tech: ["Web Audio API", "Compute Shaders", "Post-processing"],
    year: "2024",
  },
];

export default function ProjectShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="min-h-screen py-32 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
          <span className="text-xs tracking-[0.3em] text-muted uppercase font-mono">
            Selected Work
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-accent/50 to-transparent" />
        </div>

        <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 tracking-tight">
          <span className="text-accent">Projects</span>
        </h2>

        <div ref={containerRef} className="space-y-1">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative border-t border-white/5 transition-all duration-500"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hover background glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,255,170,0.03) 0%, rgba(0,255,170,0.01) 50%, transparent 100%)",
                }}
              />

              <div className="relative flex items-center py-8 md:py-10 cursor-pointer">
                {/* Number */}
                <span className="text-xs font-mono text-muted w-12 shrink-0 group-hover:text-accent transition-colors duration-300">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Title */}
                <h3 className="text-2xl md:text-4xl font-bold flex-1 group-hover:text-accent transition-colors duration-300 tracking-tight">
                  {project.title}
                </h3>

                {/* Category */}
                <span className="hidden md:block text-sm text-muted group-hover:text-fg/60 transition-colors duration-300 w-48 text-right">
                  {project.category}
                </span>

                {/* Year */}
                <span className="text-xs font-mono text-muted ml-8 w-16 text-right group-hover:text-accent/60 transition-colors duration-300">
                  {project.year}
                </span>

                {/* Arrow */}
                <div className="ml-8 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-accent"
                  >
                    <path
                      d="M4 10H16M16 10L11 5M16 10L11 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Expanded details */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{
                  maxHeight: hoveredIndex === index ? "200px" : "0",
                  opacity: hoveredIndex === index ? 1 : 0,
                }}
              >
                <div className="pb-8 pl-12 pr-8 flex flex-col md:flex-row gap-6">
                  <p className="text-sm text-muted leading-relaxed flex-1 max-w-lg">
                    {project.description}
                  </p>
                  <div className="flex gap-2 flex-wrap items-start">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-mono px-3 py-1 border border-accent/20 text-accent/70 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-white/5" />
        </div>
      </div>
    </section>
  );
}
