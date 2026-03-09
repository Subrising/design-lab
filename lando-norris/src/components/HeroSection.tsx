"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Number 4 slams in from the right
      tl.fromTo(
        numberRef.current,
        { x: 300, opacity: 0, scale: 1.5 },
        { x: 0, opacity: 0.08, scale: 1, duration: 1, ease: "power4.out" }
      );

      // Name reveals with split text effect
      const chars = nameRef.current?.querySelectorAll(".char");
      if (chars) {
        tl.fromTo(
          chars,
          { y: 120, opacity: 0, rotateX: -90 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }

      // Racing line draws across
      tl.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
        "-=0.3"
      );

      // Tagline fades in
      tl.fromTo(
        taglineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

      // Badge pops in
      tl.fromTo(
        badgeRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
        "-=0.2"
      );

      // Continuous floating animation on number
      gsap.to(numberRef.current, {
        y: -15,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nameChars = "LANDO NORRIS".split("").map((char, i) => (
    <span
      key={i}
      className="char inline-block"
      style={{ display: char === " " ? "inline" : "inline-block" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Giant background number */}
      <div
        ref={numberRef}
        className="absolute select-none pointer-events-none"
        style={{
          fontSize: "clamp(300px, 50vw, 800px)",
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          color: "#FF8000",
          opacity: 0.08,
          lineHeight: 0.85,
          right: "-5%",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        4
      </div>

      <div className="relative z-10 text-center px-4">
        {/* McLaren badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-papaya/30 rounded-full"
        >
          <div className="w-2 h-2 rounded-full bg-papaya animate-pulse" />
          <span className="text-sm tracking-[0.3em] uppercase text-papaya font-medium">
            McLaren F1 Driver
          </span>
        </div>

        {/* Main name */}
        <h1
          ref={nameRef}
          className="leading-none mb-6"
          style={{
            fontSize: "clamp(48px, 12vw, 180px)",
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            letterSpacing: "-0.02em",
            perspective: "800px",
          }}
        >
          {nameChars}
        </h1>

        {/* Racing line */}
        <div
          ref={lineRef}
          className="mx-auto mb-8"
          style={{
            width: "min(400px, 80vw)",
            height: "3px",
            background: "linear-gradient(90deg, transparent, #FF8000, #0090FF, transparent)",
          }}
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-lg md:text-xl tracking-[0.2em] uppercase text-smoke-dark"
        >
          Bold &bull; Fast &bull; Unstoppable
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs tracking-[0.3em] uppercase text-smoke-dark">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-papaya to-transparent" />
      </div>
    </section>
  );
}
