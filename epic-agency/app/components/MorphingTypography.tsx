"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORDS = ["CREATE", "DESIGN", "BUILD", "DREAM", "SHAPE"];

export default function MorphingTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  const splitText = useCallback((word: string) => {
    return word.split("").map((char, i) => (
      <span key={`${word}-${i}`} className="char-wrap">
        <span
          ref={(el) => {
            if (el) charsRef.current[i] = el;
          }}
          className="char"
        >
          {char}
        </span>
      </span>
    ));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: `+=${WORDS.length * 100}%`,
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const idx = Math.min(
          Math.floor(self.progress * WORDS.length),
          WORDS.length - 1
        );
        setCurrentIndex(idx);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  useEffect(() => {
    charsRef.current.forEach((char, i) => {
      if (!char) return;
      gsap.fromTo(
        char,
        {
          y: 80,
          opacity: 0,
          rotateX: -90,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.6,
          delay: i * 0.04,
          ease: "power3.out",
        }
      );
    });
  }, [currentIndex]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--color-epic-black)" }}
    >
      {/* Background index number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-sans text-[40vw] font-bold leading-none"
          style={{ color: "rgba(245, 240, 235, 0.03)" }}
        >
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Morphing word */}
      <div ref={textRef} className="relative z-10 text-center" style={{ perspective: "1000px" }}>
        <h1 className="display-huge font-sans font-bold tracking-tighter">
          {splitText(WORDS[currentIndex])}
        </h1>
        <div className="mt-8 flex items-center justify-center gap-6">
          {WORDS.map((_, i) => (
            <div
              key={i}
              className="h-[2px] transition-all duration-500"
              style={{
                width: i === currentIndex ? "60px" : "20px",
                background:
                  i === currentIndex
                    ? "var(--color-epic-red)"
                    : "rgba(245, 240, 235, 0.2)",
              }}
            />
          ))}
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] opacity-40">
          Scroll to morph — {String(currentIndex + 1).padStart(2, "0")}/
          {String(WORDS.length).padStart(2, "0")}
        </p>
      </div>

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-16 h-[1px] bg-epic-warm opacity-30" />
      <div className="absolute top-8 left-8 w-[1px] h-16 bg-epic-warm opacity-30" />
      <div className="absolute bottom-8 right-8 w-16 h-[1px] bg-epic-warm opacity-30" />
      <div className="absolute bottom-8 right-8 w-[1px] h-16 bg-epic-warm opacity-30" />
    </section>
  );
}
