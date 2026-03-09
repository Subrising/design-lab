"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TextRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Large text scrub reveal
      const chars = sectionRef.current?.querySelectorAll(".reveal-char");
      if (chars) {
        gsap.fromTo(
          chars,
          { opacity: 0.1, y: 0 },
          {
            opacity: 1,
            stagger: 0.03,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 1,
            },
          }
        );
      }

      // Decorative lines
      const lines = sectionRef.current?.querySelectorAll(".deco-line");
      lines?.forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: line,
              start: "top 80%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const text =
    "We believe great software should feel as good as it works. Every pixel, every transition, every interaction — designed with obsessive attention to craft.";

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 px-6 md:px-12 section-wrapper">
      <div className="max-w-6xl mx-auto">
        <div
          className="deco-line h-px bg-[#27272a] mb-16 origin-left"
          style={{ transform: "scaleX(0)" }}
        />

        <p className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
          {text.split("").map((char, i) => (
            <span key={i} className="reveal-char inline" style={{ opacity: 0.1 }}>
              {char}
            </span>
          ))}
        </p>

        <div
          className="deco-line h-px bg-[#27272a] mt-16 origin-right"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
