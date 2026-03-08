"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-40 px-6">
      <div ref={contentRef} className="max-w-4xl mx-auto text-center">
        {/* Glow backdrop */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124, 92, 252, 0.15), transparent 60%)",
            filter: "blur(100px)",
          }}
        />

        <h2 className="relative z-10 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Ready to build
          <br />
          <span className="text-gradient">something extraordinary?</span>
        </h2>

        <p className="relative z-10 mt-6 text-lg text-white/40 max-w-md mx-auto">
          Join thousands of teams already shipping faster with Obsidian.
          Free to start, scales with you.
        </p>

        <div className="relative z-10 mt-10 flex items-center justify-center gap-4">
          <button className="magnetic-btn text-base px-8 py-4">
            Start building — it&apos;s free
          </button>
        </div>

        <p className="relative z-10 mt-6 text-xs text-white/20">
          No credit card required · Setup in 30 seconds · Cancel anytime
        </p>
      </div>
    </section>
  );
}
