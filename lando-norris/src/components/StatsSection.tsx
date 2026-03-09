"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 7, suffix: "", label: "RACE WINS", color: "#FF8000" },
  { value: 21, suffix: "", label: "PODIUMS", color: "#FF8000" },
  { value: 1, suffix: "ST", label: "IN CHAMPIONSHIP", color: "#0090FF" },
  { value: 200, suffix: "+", label: "RACES STARTED", color: "#FF8000" },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Stat cards stagger in
      statsRef.current.forEach((stat, i) => {
        if (!stat) return;

        // Card entrance
        gsap.fromTo(
          stat,
          { y: 100, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Number count up
        const valueEl = stat.querySelector(".stat-value");
        if (valueEl) {
          const target = stats[i].value;
          gsap.fromTo(
            { val: 0 },
            { val: target },
            {
              val: target,
              duration: 2,
              delay: i * 0.15 + 0.3,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 60%",
                toggleActions: "play none none reverse",
              },
              onUpdate: function () {
                valueEl.textContent = Math.round(this.targets()[0].val).toString();
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-4"
    >
      <h2
        ref={headingRef}
        className="text-center mb-16"
        style={{
          fontSize: "clamp(32px, 6vw, 80px)",
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          letterSpacing: "0.05em",
        }}
      >
        BY THE{" "}
        <span className="text-papaya">NUMBERS</span>
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={(el) => { if (el) statsRef.current[i] = el; }}
            className="relative group p-8 rounded-2xl border border-white/5 bg-carbon-light/50 backdrop-blur-sm hover:border-papaya/30 transition-all duration-500"
          >
            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at center, ${stat.color}10, transparent 70%)`,
              }}
            />

            <div className="relative z-10">
              <div
                className="stat-value stat-number font-bold leading-none mb-2"
                style={{
                  fontSize: "clamp(40px, 5vw, 72px)",
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  color: stat.color,
                }}
              >
                0
              </div>
              <span
                className="text-xl md:text-2xl"
                style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  color: stat.color,
                  opacity: 0.7,
                }}
              >
                {stat.suffix}
              </span>
              <p className="text-sm tracking-[0.2em] uppercase text-smoke-dark mt-3">
                {stat.label}
              </p>
            </div>

            {/* Corner accent */}
            <div
              className="absolute top-0 right-0 w-12 h-12 opacity-20"
              style={{
                borderTop: `2px solid ${stat.color}`,
                borderRight: `2px solid ${stat.color}`,
                borderRadius: "0 16px 0 0",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
