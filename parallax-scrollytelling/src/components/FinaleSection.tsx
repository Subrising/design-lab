"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FinaleSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    // Scale up from small
    gsap.from(textRef.current, {
      scale: 0.3,
      opacity: 0,
      filter: "blur(20px)",
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });

    // Radial lines
    const lines = sectionRef.current.querySelectorAll(".radial-line");
    gsap.from(lines, {
      scaleX: 0,
      stagger: 0.05,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 50%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className="section-full relative">
      {/* Radial burst */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="radial-line absolute h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"
            style={{
              width: "80%",
              transform: `rotate(${i * 15}deg)`,
              transformOrigin: "center",
            }}
          />
        ))}
      </div>

      {/* Pulsing glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      <div ref={textRef} className="relative z-10 text-center px-6">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-glow">
          Build{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Immersive
          </span>
        </h2>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mt-2">
          Experiences
        </h2>
        <p className="mt-8 text-xl text-gray-400 max-w-xl mx-auto">
          GSAP ScrollTrigger + Next.js + Tailwind CSS
        </p>

        <div className="mt-12 flex gap-4 justify-center flex-wrap">
          <span className="px-4 py-2 rounded-full border border-indigo-500/30 text-indigo-400 text-sm">
            gsap
          </span>
          <span className="px-4 py-2 rounded-full border border-purple-500/30 text-purple-400 text-sm">
            ScrollTrigger
          </span>
          <span className="px-4 py-2 rounded-full border border-pink-500/30 text-pink-400 text-sm">
            Next.js 15
          </span>
          <span className="px-4 py-2 rounded-full border border-rose-500/30 text-rose-400 text-sm">
            Tailwind v4
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
