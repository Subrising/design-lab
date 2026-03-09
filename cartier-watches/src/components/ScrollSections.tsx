"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: "hero",
    label: "The Tank Française",
    subtitle: "Watches & Wonders 2024",
    description:
      "An icon of geometric purity. The Tank Française redefines elegance through architectural precision and timeless refinement.",
    align: "center" as const,
  },
  {
    id: "craft",
    label: "Master Craftsmanship",
    subtitle: "Métiers d'Art",
    description:
      "Each timepiece is meticulously assembled by master watchmakers in La Chaux-de-Fonds, where centuries of tradition meet contemporary innovation.",
    align: "left" as const,
  },
  {
    id: "detail",
    label: "Exquisite Detail",
    subtitle: "The Dial",
    description:
      "Guilloché patterns dance across the silver-grained dial, catching light with every subtle movement of the wrist. Roman numerals rendered in Cartier's signature typeface.",
    align: "right" as const,
  },
  {
    id: "movement",
    label: "In-House Movement",
    subtitle: "Calibre 1847 MC",
    description:
      "A mechanical heart beating at 28,800 vibrations per hour. The automatic movement combines Swiss precision with Cartier's uncompromising standards.",
    align: "left" as const,
  },
  {
    id: "finale",
    label: "Timeless by Design",
    subtitle: "Since 1917",
    description:
      "From Louis Cartier's original sketch to the wrists of the world's most discerning collectors. Over a century of unbroken elegance.",
    align: "center" as const,
  },
];

export function ScrollSections() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".scroll-panel");

      panels.forEach((panel) => {
        const content = panel.querySelector(".panel-content");
        const line = panel.querySelector(".gold-line");
        const label = panel.querySelector(".panel-label");
        const subtitle = panel.querySelector(".panel-subtitle");
        const desc = panel.querySelector(".panel-desc");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 70%",
            end: "top 20%",
            scrub: 0.8,
          },
        });

        tl.fromTo(
          content,
          { opacity: 0 },
          { opacity: 1, duration: 1 }
        );

        if (line) {
          tl.fromTo(
            line,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8 },
            0
          );
        }

        if (subtitle) {
          tl.fromTo(
            subtitle,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            0.1
          );
        }

        if (label) {
          tl.fromTo(
            label,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8 },
            0.2
          );
        }

        if (desc) {
          tl.fromTo(
            desc,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6 },
            0.4
          );
        }

        // Fade out as panel scrolls past
        gsap.to(content, {
          opacity: 0,
          y: -40,
          scrollTrigger: {
            trigger: panel,
            start: "bottom 50%",
            end: "bottom 10%",
            scrub: 0.5,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 pointer-events-none">
      {sections.map((section, i) => (
        <section
          key={section.id}
          className={`scroll-panel min-h-screen flex items-center ${
            section.align === "center"
              ? "justify-center text-center"
              : section.align === "left"
              ? "justify-start pl-8 md:pl-24"
              : "justify-end pr-8 md:pr-24"
          }`}
        >
          <div
            className={`panel-content max-w-lg ${
              section.align === "center" ? "mx-auto" : ""
            }`}
            style={{ opacity: i === 0 ? undefined : 0 }}
          >
            <div
              className="gold-line h-px bg-gold mb-6 origin-left"
              style={{ width: "60px" }}
            />
            <p className="panel-subtitle text-gold/70 text-xs tracking-[0.4em] uppercase mb-4 font-sans">
              {section.subtitle}
            </p>
            <h2 className="panel-label font-display text-4xl md:text-6xl text-pearl tracking-wide mb-6 leading-tight">
              {section.label}
            </h2>
            <p className="panel-desc text-pearl/50 text-sm md:text-base leading-relaxed font-light max-w-md">
              {section.description}
            </p>
            {i === 0 && (
              <div className="mt-10">
                <span className="text-gold/60 text-xs tracking-[0.3em] uppercase animate-pulse">
                  Scroll to explore
                </span>
              </div>
            )}
            {i === sections.length - 1 && (
              <div className="mt-10 pointer-events-auto">
                <button className="border border-gold/40 text-gold text-xs tracking-[0.3em] uppercase px-10 py-4 hover:bg-gold/10 transition-all duration-700 font-sans">
                  Discover the Collection
                </button>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
