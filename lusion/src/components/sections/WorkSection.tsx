"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Nebula",
    category: "Interactive Experience",
    year: "2024",
    description: "Real-time particle system with 100K elements responding to audio input",
    gradient: "from-purple-900/40 to-blue-900/40",
  },
  {
    title: "Morphic",
    category: "WebGL Installation",
    year: "2024",
    description: "Generative geometry morphing between organic and geometric forms",
    gradient: "from-blue-900/40 to-cyan-900/40",
  },
  {
    title: "Flux",
    category: "Brand Experience",
    year: "2023",
    description: "Fluid simulation driven by cursor movement with GLSL raymarching",
    gradient: "from-violet-900/40 to-fuchsia-900/40",
  },
  {
    title: "Prism",
    category: "Digital Art",
    year: "2023",
    description: "Light refraction simulation with physically-based rendering",
    gradient: "from-indigo-900/40 to-purple-900/40",
  },
];

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 100, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative z-10 py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-20">Selected Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
              data-cursor-hover
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

              {/* Animated grid pattern */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <svg width="100%" height="100%" className="absolute inset-0">
                  <defs>
                    <pattern id={`grid-${i}`} width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#grid-${i})`} />
                </svg>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                      {project.category} — {project.year}
                    </p>
                    <h3 className="text-4xl font-light tracking-tight">{project.title}</h3>
                    <p className="text-sm text-white/40 mt-2 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {project.description}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 13L13 1M13 1H3M13 1V11" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
