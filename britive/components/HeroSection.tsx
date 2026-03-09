"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.8 });

      // Badge entrance
      tl.fromTo(
        badgeRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      );

      // Split heading into words and animate
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll(".word");
        tl.fromTo(
          words,
          { y: 120, opacity: 0, rotateX: -40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=0.4"
        );
      }

      // Subtitle
      tl.fromTo(
        subRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );

      // CTA buttons
      tl.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headingWords = [
    "Build",
    "extraordinary",
    "digital",
    "experiences",
    "that",
    "captivate.",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center section-wrapper"
    >
      <div ref={badgeRef} style={{ opacity: 0 }}>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#27272a] bg-[#18181b]/50 text-xs text-[#71717a] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#6366f1] animate-pulse" />
          Now in public beta — V3.0
        </span>
      </div>

      <h1
        ref={headingRef}
        className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight max-w-5xl"
        style={{ perspective: "1000px" }}
      >
        {headingWords.map((word, i) => (
          <span
            key={i}
            className="word inline-block mr-[0.25em]"
            style={{
              opacity: 0,
              transformStyle: "preserve-3d",
            }}
          >
            {i === 1 || i === 3 ? (
              <span className="gradient-text">{word}</span>
            ) : (
              word
            )}
          </span>
        ))}
      </h1>

      <p
        ref={subRef}
        className="mt-8 text-lg md:text-xl text-[#71717a] max-w-2xl leading-relaxed"
        style={{ opacity: 0 }}
      >
        A premium platform for teams who demand excellence. Craft interfaces
        that move with purpose, delight with detail, and scale without limits.
      </p>

      <div
        ref={ctaRef}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        style={{ opacity: 0 }}
      >
        <button className="px-8 py-4 bg-[#6366f1] text-white rounded-full text-sm font-medium hover:bg-[#818cf8] transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]">
          Start Building Free
        </button>
        <button className="px-8 py-4 border border-[#27272a] text-white rounded-full text-sm font-medium hover:bg-[#18181b] transition-colors">
          Watch Demo
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-[#71717a] tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[#71717a] to-transparent" />
      </div>
    </section>
  );
}
