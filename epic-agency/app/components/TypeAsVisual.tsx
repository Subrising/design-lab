"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TypeAsVisual() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Horizontal scroll of massive text lines
    if (line1Ref.current) {
      gsap.to(line1Ref.current, {
        xPercent: -20,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    if (line2Ref.current) {
      gsap.to(line2Ref.current, {
        xPercent: 15,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    if (line3Ref.current) {
      gsap.to(line3Ref.current, {
        xPercent: -10,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    // Color overlay
    if (overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "center center",
            scrub: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden py-20"
      style={{ background: "var(--color-epic-charcoal)" }}
    >
      {/* Color shift overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(230,57,70,0.08) 0%, rgba(91,33,182,0.08) 50%, rgba(29,53,87,0.08) 100%)",
        }}
      />

      {/* Massive scrolling text lines */}
      <div className="relative z-10 space-y-4">
        <div ref={line1Ref} className="whitespace-nowrap -ml-[10%]">
          <span className="font-sans text-[12vw] md:text-[10vw] font-bold leading-none tracking-tighter opacity-10">
            VISUAL STORYTELLING THROUGH TYPE — VISUAL STORYTELLING THROUGH TYPE —
          </span>
        </div>

        <div ref={line2Ref} className="whitespace-nowrap -ml-[30%]">
          <span
            className="font-sans text-[12vw] md:text-[10vw] font-bold leading-none tracking-tighter"
            style={{ WebkitTextStroke: "1px rgba(245, 240, 235, 0.15)", color: "transparent" }}
          >
            CRAFT EVERY DETAIL — CRAFT EVERY DETAIL — CRAFT EVERY DETAIL
          </span>
        </div>

        <div ref={line3Ref} className="whitespace-nowrap -ml-[5%]">
          <span className="font-sans text-[12vw] md:text-[10vw] font-bold leading-none tracking-tighter opacity-10">
            BOLD CREATIVE VISION — BOLD CREATIVE VISION — BOLD CREATIVE
          </span>
        </div>
      </div>

      {/* Center overlay content */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center max-w-2xl px-8">
          <p className="text-xs uppercase tracking-[0.5em] opacity-50 mb-8">
            Our Manifesto
          </p>
          <h3 className="text-3xl md:text-5xl font-sans font-light leading-tight mb-8">
            Typography is not
            <br />
            <span className="font-bold italic" style={{ color: "var(--color-epic-red)" }}>
              decoration
            </span>
            .
            <br />
            It is{" "}
            <span className="font-bold italic" style={{ color: "var(--color-epic-warm)" }}>
              architecture
            </span>
            .
          </h3>
          <div className="w-12 h-[1px] mx-auto" style={{ background: "var(--color-epic-warm)" }} />
        </div>
      </div>
    </section>
  );
}
