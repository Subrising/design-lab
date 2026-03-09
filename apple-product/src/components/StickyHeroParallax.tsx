"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StickyHeroParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Parallax background moves slower
      gsap.to(bgRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Orbs move at different speed
      gsap.to(orbsRef.current, {
        yPercent: -15,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Headline scales up and fades
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=150%",
          scrub: 0.5,
          pin: true,
        },
      });

      tl.fromTo(
        headlineRef.current,
        { scale: 0.8, opacity: 0, y: 60 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      )
        .fromTo(
          sublineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.2 },
          0.15
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.2 },
          0.25
        )
        .to({}, { duration: 0.2 }) // Hold
        .to(
          headlineRef.current,
          { scale: 1.1, opacity: 0, y: -40, duration: 0.3 },
        )
        .to(
          sublineRef.current,
          { opacity: 0, y: -30, duration: 0.2 },
          "-=0.2"
        )
        .to(
          ctaRef.current,
          { opacity: 0, y: -20, duration: 0.2 },
          "-=0.15"
        );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Parallax background */}
      <div ref={bgRef} className="absolute inset-0 -top-[20%] -bottom-[20%]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a1a] to-black" />

        {/* Animated gradient orbs */}
        <div ref={orbsRef} className="absolute inset-0">
          <div
            className="absolute rounded-full blur-[120px] opacity-20"
            style={{
              width: "600px",
              height: "600px",
              background: "radial-gradient(circle, #0071e3, transparent)",
              top: "20%",
              left: "10%",
            }}
          />
          <div
            className="absolute rounded-full blur-[100px] opacity-15"
            style={{
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, #6e3aff, transparent)",
              top: "40%",
              right: "5%",
            }}
          />
          <div
            className="absolute rounded-full blur-[80px] opacity-10"
            style={{
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, #00c2ff, transparent)",
              bottom: "10%",
              left: "30%",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[#2997ff] font-semibold text-lg tracking-wide uppercase mb-4">
          New
        </p>
        <h1
          ref={headlineRef}
          className="font-display tracking-tight"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
          }}
        >
          <span className="text-white">iPhone 16 Pro</span>
          <br />
          <span className="text-gradient-gold">Built for Apple Intelligence.</span>
        </h1>
        <p
          ref={sublineRef}
          className="mt-6 text-[#86868b] max-w-2xl"
          style={{ fontSize: "clamp(18px, 2.5vw, 28px)", fontWeight: 600 }}
        >
          The first iPhone designed from the ground up for Apple Intelligence.
          Personal, private, powerful.
        </p>
        <div ref={ctaRef} className="mt-8 flex gap-6 items-center">
          <button className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-8 py-3 rounded-full text-lg font-medium transition-colors">
            Buy
          </button>
          <a className="apple-link" style={{ fontSize: "21px" }}>
            Learn more &gt;
          </a>
        </div>
      </div>
    </div>
  );
}
