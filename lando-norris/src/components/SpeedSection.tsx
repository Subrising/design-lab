"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SpeedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLSpanElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the speed section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=150%",
        pin: true,
        pinSpacing: true,
      });

      // Speed counter
      const speedEl = speedRef.current;
      if (speedEl) {
        gsap.fromTo(
          { val: 0 },
          { val: 372 },
          {
            val: 372,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=150%",
              scrub: 1,
            },
            onUpdate: function () {
              speedEl.textContent = Math.round(this.targets()[0].val).toString();
            },
          }
        );
      }

      // Unit label reveal
      gsap.fromTo(
        unitRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=30%",
            scrub: 1,
          },
        }
      );

      // Speed bars
      if (barsRef.current) {
        const bars = barsRef.current.children;
        gsap.fromTo(
          bars,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=100%",
              scrub: 1,
            },
          }
        );
      }

      // Horizontal speed lines
      const lines = sectionRef.current?.querySelectorAll(".speed-line");
      if (lines) {
        gsap.fromTo(
          lines,
          { x: "-100%", opacity: 0 },
          {
            x: "200%",
            opacity: [0, 1, 1, 0],
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=150%",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Flying speed lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="speed-line absolute"
          style={{
            top: `${15 + i * 10}%`,
            left: 0,
            width: `${60 + Math.random() * 100}px`,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${
              i % 2 === 0 ? "#FF8000" : "#0090FF"
            }, transparent)`,
            opacity: 0.4,
          }}
        />
      ))}

      <div className="relative z-10 text-center">
        {/* TOP SPEED label */}
        <p className="text-sm tracking-[0.5em] uppercase text-smoke-dark mb-4">
          Top Speed
        </p>

        {/* Giant speed number */}
        <div className="flex items-baseline justify-center gap-4">
          <div
            ref={speedRef}
            className="stat-number"
            style={{
              fontSize: "clamp(80px, 20vw, 280px)",
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              lineHeight: 0.9,
              background: "linear-gradient(180deg, #FFFFFF, #FF8000)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            0
          </div>
          <span
            ref={unitRef}
            className="text-smoke-dark"
            style={{
              fontSize: "clamp(20px, 4vw, 48px)",
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            KM/H
          </span>
        </div>

        {/* Speed bars visualization */}
        <div ref={barsRef} className="mt-12 flex flex-col items-center gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: `${40 + i * 15}px`,
                height: "3px",
                background: `linear-gradient(90deg, #FF8000 ${
                  ((i + 1) / 12) * 100
                }%, #0090FF)`,
                borderRadius: "2px",
                opacity: 0.3 + (i / 12) * 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 128, 0, 0.05), transparent 60%)",
        }}
      />
    </section>
  );
}
