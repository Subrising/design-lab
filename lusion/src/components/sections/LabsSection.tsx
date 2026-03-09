"use client";
import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiments = [
  { title: "Particle Field", description: "100K particles with GPU compute", number: "01" },
  { title: "Fluid Dynamics", description: "Real-time Navier-Stokes simulation", number: "02" },
  { title: "Neural Mesh", description: "AI-driven generative geometry", number: "03" },
  { title: "Photon Trace", description: "Path tracing in WebGL 2.0", number: "04" },
  { title: "Voxel Space", description: "Procedural terrain with marching cubes", number: "05" },
];

export default function LabsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  const setRef = useCallback((el: HTMLDivElement | null, i: number) => {
    if (el) itemsRef.current[i] = el;
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="labs" className="relative z-10 py-40 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">Labs</h2>
        <p className="text-lg text-white/30 font-light mb-20 max-w-md">
          Experimental work exploring the bleeding edge of web graphics
        </p>

        <div className="space-y-0">
          {experiments.map((exp, i) => (
            <div
              key={exp.number}
              ref={(el) => setRef(el, i)}
              className="group border-t border-white/10 last:border-b py-8 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors px-4 -mx-4"
              data-cursor-hover
            >
              <div className="flex items-center gap-8">
                <span className="text-xs text-white/20 font-mono">{exp.number}</span>
                <div>
                  <h3 className="text-2xl font-light group-hover:text-purple-300 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-white/30 mt-1">{exp.description}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                >
                  <path d="M1 11L11 1M11 1H3M11 1V9" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
