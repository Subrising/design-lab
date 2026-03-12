"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Animate title characters
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".hero-char");
      tl.fromTo(
        chars,
        { y: "120%", rotateX: -80, opacity: 0 },
        {
          y: "0%",
          rotateX: 0,
          opacity: 1,
          stagger: 0.03,
          duration: 1,
          ease: "power4.out",
        }
      );
    }

    // Subtitle
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
    }

    // Line expand
    if (lineRef.current) {
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
        "-=0.6"
      );
    }

    // Scroll indicator
    if (scrollRef.current) {
      tl.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.3"
      );

      // Repeating bounce
      gsap.to(scrollRef.current, {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "power2.inOut",
        delay: 2,
      });
    }

    // Parallax on scroll
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scroll = window.scrollY;
      gsap.set(titleRef.current, { y: scroll * 0.3, opacity: 1 - scroll / 800 });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const titleText = "EPIC";
  const subtitle = "CREATIVE STUDIO";

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--color-epic-black)" }}
    >
      {/* Grid lines background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-[1px]"
            style={{
              left: `${(i + 1) * (100 / 7)}%`,
              background: "rgba(245, 240, 235, 0.04)",
            }}
          />
        ))}
      </div>

      {/* Main title */}
      <div className="relative z-10 text-center" style={{ perspective: "1000px" }}>
        <p className="text-xs uppercase tracking-[0.5em] opacity-40 mb-8">
          A Creative Agency
        </p>

        <h1
          ref={titleRef}
          className="font-sans font-bold leading-none tracking-tighter"
          style={{ fontSize: "clamp(6rem, 22vw, 24rem)" }}
        >
          {titleText.split("").map((char, i) => (
            <span key={i} className="hero-char inline-block" style={{ transformStyle: "preserve-3d" }}>
              {char}
            </span>
          ))}
          <span className="hero-char inline-block" style={{ color: "var(--color-epic-red)" }}>
            .
          </span>
        </h1>

        <div
          ref={lineRef}
          className="w-24 h-[1px] mx-auto mt-8 origin-center"
          style={{ background: "var(--color-epic-warm)" }}
        />

        <p
          ref={subtitleRef}
          className="mt-8 text-sm uppercase tracking-[0.4em] opacity-50"
        >
          {subtitle.split("").map((char, i) => (
            <span key={i} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-30">
          Scroll
        </span>
        <div className="w-[1px] h-8" style={{ background: "var(--color-epic-warm)", opacity: 0.3 }} />
      </div>

      {/* Side label */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block">
        <p
          className="text-[10px] uppercase tracking-[0.5em] opacity-20"
          style={{ writingMode: "vertical-rl" }}
        >
          Established 2007
        </p>
      </div>
    </section>
  );
}
