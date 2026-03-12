"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  {
    bg: "#e63946",
    text: "#f5f0eb",
    title: "STRATEGY",
    desc: "Understanding the why before the what. Every creative decision anchored in insight.",
    number: "01",
  },
  {
    bg: "#1d3557",
    text: "#f5f0eb",
    title: "DESIGN",
    desc: "Where form meets function. Pushing boundaries while serving the brand's core truth.",
    number: "02",
  },
  {
    bg: "#556b2f",
    text: "#f5f0eb",
    title: "MOTION",
    desc: "Bringing ideas to life through movement. Every frame a deliberate choice.",
    number: "03",
  },
  {
    bg: "#5b21b6",
    text: "#f5f0eb",
    title: "DIGITAL",
    desc: "Experiences that transcend screens. Interactive narratives that captivate and convert.",
    number: "04",
  },
];

export default function ColorTransitions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const panels = panelsRef.current;
    if (!panels.length) return;

    panels.forEach((panel) => {
      // Panel background reveal
      gsap.fromTo(
        panel,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      // Inner content stagger
      const inner = panel.querySelectorAll(".reveal-item");
      gsap.fromTo(
        inner,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 50%",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative">
      {SECTIONS.map((s, i) => (
        <div
          key={s.title}
          ref={(el) => {
            if (el) panelsRef.current[i] = el;
          }}
          className="relative min-h-screen flex items-center"
          style={{ background: s.bg, color: s.text }}
        >
          <div className="max-w-[1800px] mx-auto w-full px-4 md:px-8 py-32">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              {/* Large number */}
              <div className="md:col-span-3">
                <span className="reveal-item block text-[8rem] md:text-[12rem] font-sans font-bold leading-none opacity-20">
                  {s.number}
                </span>
              </div>

              {/* Title */}
              <div className="md:col-span-5">
                <h3 className="reveal-item font-sans font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-none">
                  {s.title}
                </h3>
              </div>

              {/* Description */}
              <div className="md:col-span-4">
                <p className="reveal-item text-lg md:text-xl leading-relaxed opacity-80">
                  {s.desc}
                </p>
                <div className="reveal-item mt-8 flex items-center gap-4 cursor-pointer group">
                  <span className="text-sm uppercase tracking-[0.3em]">
                    Explore
                  </span>
                  <div className="w-8 h-[1px] bg-current transition-all group-hover:w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Corner label */}
          <div className="absolute bottom-8 left-8 text-xs uppercase tracking-[0.3em] opacity-30">
            {s.number} / {String(SECTIONS.length).padStart(2, "0")}
          </div>
        </div>
      ))}
    </section>
  );
}
