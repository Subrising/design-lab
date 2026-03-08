"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(orbRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
      })
        .from(
          headingRef.current,
          {
            y: 80,
            opacity: 0,
            duration: 1.2,
          },
          "-=0.8"
        )
        .from(
          subRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 1,
          },
          "-=0.6"
        )
        .from(
          ctaRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.4"
        );

      // Parallax on scroll
      gsap.to(orbRef.current, {
        y: -200,
        scale: 0.8,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(headingRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "20% top",
          end: "60% top",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Floating orb */}
      <div
        ref={orbRef}
        className="absolute w-[500px] h-[500px] rounded-full orb"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(124, 92, 252, 0.3), rgba(192, 132, 252, 0.15), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Badge */}
      <div className="relative z-10 mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        Now in public beta
      </div>

      {/* Main heading */}
      <h1
        ref={headingRef}
        className="relative z-10 text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9]"
      >
        <span className="block text-white">Build at the</span>
        <span className="block text-gradient mt-2">speed of thought</span>
      </h1>

      {/* Sub text */}
      <p
        ref={subRef}
        className="relative z-10 mt-8 max-w-lg text-center text-lg text-white/40 leading-relaxed"
      >
        The next-generation platform for teams who refuse to compromise.
        Beautifully crafted. Blazingly fast. Obsessively refined.
      </p>

      {/* CTA */}
      <div ref={ctaRef} className="relative z-10 mt-10 flex items-center gap-4">
        <button className="magnetic-btn">
          Get started free
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
        <button className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm text-white/70 backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:text-white">
          Watch demo
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-xs text-white/20 uppercase tracking-[0.3em]">
          Scroll
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
