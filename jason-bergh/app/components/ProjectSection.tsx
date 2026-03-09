"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  subtitle: string;
  category: string;
  year: string;
  color: string;
  gradient: string;
  index: number;
  total: number;
}

function SplitChars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="char"
          style={{
            transform: "translateY(110%) rotateX(-80deg)",
            opacity: 0,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}

export default function ProjectSection({
  title,
  subtitle,
  category,
  year,
  color,
  gradient,
  index,
  total,
}: Project) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current!;
      const chars = titleRef.current!.querySelectorAll(".char");

      // Main scroll-triggered timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      });

      // Image reveal — clip-path from bottom
      tl.fromTo(
        imageRef.current,
        { clipPath: "inset(100% 0 0 0)", scale: 1.3 },
        { clipPath: "inset(0% 0 0 0)", scale: 1.05, duration: 1, ease: "power2.inOut" },
        0
      );

      // Overlay fade
      tl.fromTo(
        overlayRef.current,
        { opacity: 0.8 },
        { opacity: 0.4, duration: 1 },
        0
      );

      // Title chars reveal
      tl.to(
        chars,
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.02,
          ease: "power3.out",
        },
        0.2
      );

      // Meta info
      tl.fromTo(
        metaRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        0.4
      );

      // Line reveal
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
        0.3
      );

      // Counter
      tl.fromTo(
        counterRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5 },
        0.5
      );

      // Parallax on image while in view
      gsap.to(imageRef.current, {
        yPercent: -15,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const padIndex = String(index + 1).padStart(2, "0");
  const padTotal = String(total).padStart(2, "0");

  return (
    <section ref={sectionRef} className="section-panel">
      {/* Background image area */}
      <div
        ref={imageRef}
        className="absolute inset-0 zoom-image"
        style={{ background: gradient }}
      />

      {/* Dark overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-end w-full h-full px-8 md:px-16 lg:px-24 pb-16 md:pb-24">
        <div ref={counterRef} className="project-counter mb-6">
          {padIndex} / {padTotal}
        </div>

        <div ref={lineRef} className="reveal-line w-full max-w-md mb-8" />

        <div ref={metaRef} className="flex items-center gap-6 mb-4">
          <span
            className="text-xs tracking-[0.25em] uppercase px-3 py-1 border border-white/20 rounded-full"
            style={{ color }}
          >
            {category}
          </span>
          <span className="text-sm text-[var(--color-muted)]">{year}</span>
        </div>

        <h2
          ref={titleRef}
          className="display-heading"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 8rem)",
            perspective: "800px",
          }}
        >
          <SplitChars text={title} />
        </h2>

        <p className="sub-heading mt-4 max-w-lg" style={{ color }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}
