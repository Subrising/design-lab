"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    title: "The Preparation",
    text: "In the quiet moments before, where anticipation meets beauty. Every detail carefully placed, every breath a prelude to forever.",
  },
  {
    title: "The Ceremony",
    text: "Where two souls converge under Italian skies. The words spoken, the tears shed, the promises that echo through time.",
  },
  {
    title: "The Celebration",
    text: "Joy unbound beneath the stars. Laughter, dance, and the warmth of those who gathered to witness love triumph.",
  },
  {
    title: "The Intimacy",
    text: "Stolen glances in golden light. The world falls away, and what remains is the purest connection between two hearts.",
  },
  {
    title: "The Legacy",
    text: "Images that transcend the moment. A visual heirloom, carrying the weight of emotion for generations yet to come.",
  },
];

export function PhotoSequence() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = containerRef.current?.querySelectorAll("[data-panel]");
      if (!panels) return;

      panels.forEach((panel) => {
        const img = panel.querySelector("[data-seq-img]");
        const overlay = panel.querySelector("[data-overlay]");
        const text = panel.querySelector("[data-seq-text]");
        const number = panel.querySelector("[data-number]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top center",
            end: "bottom center",
            scrub: 0.5,
          },
        });

        // Image scales and fades in
        if (img) {
          tl.fromTo(
            img,
            { scale: 1.3, opacity: 0.3 },
            { scale: 1, opacity: 1, duration: 1 },
            0
          );
        }

        // Overlay lightens
        if (overlay) {
          tl.fromTo(
            overlay,
            { opacity: 0.7 },
            { opacity: 0.3, duration: 1 },
            0
          );
        }

        // Text slides in
        if (text) {
          tl.fromTo(
            text,
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            0.2
          );
        }

        if (number) {
          tl.fromTo(
            number,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5 },
            0.1
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Section header */}
      <div className="text-center py-24 md:py-32 px-6">
        <p
          className="font-sans text-[10px] tracking-[0.4em] uppercase text-warm-gray mb-4"
          style={{ fontWeight: 300 }}
        >
          A Wedding Day
        </p>
        <h2
          className="font-serif text-4xl md:text-6xl tracking-wide text-cream/90"
          style={{ fontWeight: 300 }}
        >
          The Story Unfolds
        </h2>
      </div>

      {chapters.map((chapter, i) => (
        <div
          key={i}
          data-panel
          className="relative h-screen w-full flex items-center justify-center overflow-hidden"
        >
          {/* Background image */}
          <div data-seq-img className="absolute inset-0">
            <img
              src={images.sequence[i]}
              alt={chapter.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dark overlay */}
          <div
            data-overlay
            className="absolute inset-0 bg-charcoal"
            style={{ opacity: 0.7 }}
          />

          {/* Chapter number */}
          <div
            data-number
            className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2"
          >
            <span
              className="font-serif text-[120px] md:text-[200px] text-cream/[0.03] leading-none"
              style={{ fontWeight: 300 }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Text content */}
          <div data-seq-text className="relative z-10 text-center max-w-2xl px-8">
            <span
              className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold/80 mb-4 block"
              style={{ fontWeight: 300 }}
            >
              Chapter {String(i + 1).padStart(2, "0")}
            </span>
            <h3
              className="font-serif text-3xl md:text-5xl tracking-wide text-cream/95 mb-6"
              style={{ fontWeight: 300 }}
            >
              {chapter.title}
            </h3>
            <p
              className="font-serif text-base md:text-lg leading-relaxed text-cream/60"
              style={{ fontWeight: 300, fontStyle: "italic" }}
            >
              {chapter.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
