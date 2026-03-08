"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Obsidian replaced our entire stack. We went from 6 tools to 1, and our velocity tripled.",
    name: "Sarah Chen",
    role: "CTO, Meridian",
    avatar: "SC",
  },
  {
    quote:
      "The attention to detail is unreal. Every pixel, every interaction — it just feels right.",
    name: "Marcus Webb",
    role: "Design Lead, Flux",
    avatar: "MW",
  },
  {
    quote:
      "We shipped our entire v2 in half the time. Obsidian's AI features are genuinely useful.",
    name: "Priya Patel",
    role: "VP Engineering, Kova",
    avatar: "PP",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll for testimonials
      const container = containerRef.current;
      if (!container) return;

      const cards = container.children;
      const totalWidth = container.scrollWidth - window.innerWidth;

      gsap.to(container, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Fade in cards as they enter
      gsap.from(cards, {
        opacity: 0.3,
        scale: 0.95,
        stagger: 0.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div className="h-full flex items-center">
        <div className="pl-8 md:pl-20 mb-20">
          <p className="text-sm font-mono text-accent uppercase tracking-[0.2em] mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Loved by teams
            <br />
            <span className="text-white/40">who ship fast</span>
          </h2>
        </div>
      </div>

      <div
        ref={containerRef}
        className="absolute top-1/2 -translate-y-1/2 left-0 flex gap-8 px-8 md:px-20 pt-20"
        style={{ width: "fit-content" }}
      >
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="flex-shrink-0 w-[500px] p-10 rounded-2xl bg-surface-elevated border border-white/[0.06] relative"
          >
            {/* Quote mark */}
            <div className="absolute top-6 right-8 text-6xl text-white/[0.04] font-serif">
              &ldquo;
            </div>

            <p className="text-xl text-white/70 leading-relaxed mb-8 relative z-10">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center text-xs font-bold text-white">
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{t.name}</div>
                <div className="text-xs text-white/30">{t.role}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Spacer for scroll end */}
        <div className="flex-shrink-0 w-[200px]" />
      </div>
    </section>
  );
}
