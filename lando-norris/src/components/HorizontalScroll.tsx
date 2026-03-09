"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const qualities = [
  {
    title: "PRECISION",
    subtitle: "0.001s",
    description: "Every millisecond counts at the limit",
    icon: "⊕",
  },
  {
    title: "COURAGE",
    subtitle: "340 KM/H",
    description: "Braking later than anyone dares",
    icon: "◈",
  },
  {
    title: "INSTINCT",
    subtitle: "0.2s",
    description: "Reaction time — faster than thought",
    icon: "◉",
  },
  {
    title: "GRIT",
    subtitle: "58 LAPS",
    description: "Endurance under extreme pressure",
    icon: "◆",
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const cards = track.querySelectorAll(".h-card");
      const totalWidth = track.scrollWidth - window.innerWidth;

      // Heading
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Horizontal scroll
      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Card reveals
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0.3, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: card,
              containerAnimation: gsap.getById?.("horizontal") || undefined,
              start: "left 80%",
              end: "left 40%",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="pt-24 pb-8 px-4">
        <h2
          ref={headingRef}
          className="text-center mb-4"
          style={{
            fontSize: "clamp(32px, 6vw, 80px)",
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          WHAT IT{" "}
          <span className="text-papaya">TAKES</span>
        </h2>
        <p className="text-center text-smoke-dark text-sm tracking-[0.3em] uppercase mb-12">
          Scroll to explore →
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex gap-8 px-[10vw] pb-24 items-center"
        style={{ width: "fit-content", minHeight: "60vh" }}
      >
        {qualities.map((q, i) => (
          <div
            key={i}
            className="h-card flex-shrink-0 w-[80vw] md:w-[40vw] lg:w-[30vw] p-10 rounded-2xl border border-white/5 bg-carbon-light/30 backdrop-blur-sm relative group overflow-hidden"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-papaya/5 to-transparent" />

            {/* Icon */}
            <div className="text-5xl mb-6 text-papaya/40">{q.icon}</div>

            {/* Subtitle */}
            <p
              className="text-papaya text-2xl mb-2"
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
            >
              {q.subtitle}
            </p>

            {/* Title */}
            <h3
              className="text-4xl md:text-5xl mb-4"
              style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              {q.title}
            </h3>

            {/* Description */}
            <p className="text-smoke-dark text-lg">{q.description}</p>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-papaya to-mclaren-blue scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />

            {/* Corner number */}
            <div
              className="absolute top-6 right-6 text-white/5"
              style={{
                fontSize: "80px",
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                lineHeight: 1,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
