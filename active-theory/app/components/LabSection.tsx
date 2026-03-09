"use client";

import { useEffect, useRef, useState } from "react";

const experiments = [
  {
    title: "Fluid Particles",
    description: "GPU-accelerated fluid simulation with 100K particles",
    gradient: "from-emerald-500/20 to-cyan-500/20",
  },
  {
    title: "Neural Mesh",
    description: "Self-organizing mesh network with spring physics",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Shader Playground",
    description: "Real-time GLSL shader composition and rendering",
    gradient: "from-amber-500/20 to-red-500/20",
  },
  {
    title: "Audio Terrain",
    description: "Terrain displacement driven by audio frequency analysis",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
];

export default function LabSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-32 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
          <span className="text-xs tracking-[0.3em] text-muted uppercase font-mono">
            Experiments
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-accent/50 to-transparent" />
        </div>

        <h2 className="text-5xl md:text-7xl font-bold text-center mb-6 tracking-tight">
          The <span className="text-accent">Lab</span>
        </h2>
        <p className="text-center text-muted text-lg mb-20 max-w-2xl mx-auto">
          Where we push boundaries and explore new frontiers in interactive
          technology.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiments.map((exp, i) => (
            <div
              key={i}
              className={`group relative p-8 md:p-12 border border-white/5 rounded-lg overflow-hidden cursor-pointer transition-all duration-500 hover:border-accent/20`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "translateY(0) scale(1)"
                  : "translateY(40px) scale(0.95)",
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms`,
              }}
            >
              {/* Gradient bg on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${exp.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Scanline effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono text-accent/50 tracking-wider">
                    EXP.{String(i + 1).padStart(3, "0")}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-accent/30 glow-pulse" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">
                  {exp.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {exp.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs font-mono text-accent/50 group-hover:text-accent transition-colors duration-300">
                  <span>Launch experiment</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M3 7H11M11 7L8 4M11 7L8 10"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
