"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SplitText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", overflow: "hidden" }}>
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              className="char"
              style={{ transform: "translateY(120%)", opacity: 0 }}
            >
              {char}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span style={{ display: "inline-block" }}>&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      const chars = titleRef.current!.querySelectorAll(".char");

      // Entrance animation
      const tl = gsap.timeline({ delay: 0.5 });

      tl.to(chars, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.03,
        ease: "power4.out",
      });

      tl.from(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.6"
      );

      tl.from(
        scrollHintRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // Scroll-out animation
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        opacity: 0,
        scale: 0.9,
        y: -100,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-panel relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
        <p ref={subtitleRef} className="sub-heading mb-6">
          Creative Director & Visual Artist
        </p>

        <h1 ref={titleRef} className="display-heading mb-8">
          <SplitText text="Jason Bergh" />
        </h1>

        <div ref={scrollHintRef} className="absolute bottom-12 flex flex-col items-center gap-3">
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
            Scroll to explore
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-[var(--color-accent)] to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
