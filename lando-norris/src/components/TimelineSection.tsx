"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  { year: "2015", event: "MSA Formula Champion", detail: "Dominating the junior series" },
  { year: "2016", event: "Formula Renault 2.0", detail: "Rising through the ranks" },
  { year: "2018", event: "Formula 2 Runner-Up", detail: "One step from the pinnacle" },
  { year: "2019", event: "F1 Debut with McLaren", detail: "The dream becomes reality" },
  { year: "2021", event: "First F1 Podium", detail: "Monza — a race for the ages" },
  { year: "2024", event: "First F1 Victory", detail: "Miami — patience pays off" },
];

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
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

      // Vertical line grows
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
          },
        }
      );

      // Timeline items reveal
      itemsRef.current.forEach((item, i) => {
        if (!item) return;

        const isLeft = i % 2 === 0;

        gsap.fromTo(
          item,
          {
            x: isLeft ? -60 : 60,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Dot pulse
        const dot = item.querySelector(".timeline-dot");
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.5,
              ease: "back.out(3)",
              scrollTrigger: {
                trigger: item,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <h2
        ref={headingRef}
        className="text-center mb-20"
        style={{
          fontSize: "clamp(32px, 6vw, 80px)",
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          letterSpacing: "0.05em",
        }}
      >
        THE{" "}
        <span className="text-papaya">JOURNEY</span>
      </h2>

      <div className="relative max-w-4xl mx-auto">
        {/* Center line */}
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{
            background: "linear-gradient(180deg, #FF8000, #0090FF, #FF8000)",
          }}
        />

        <div className="space-y-16">
          {timeline.map((item, i) => (
            <div
              key={i}
              ref={(el) => { if (el) itemsRef.current[i] = el; }}
              className={`relative flex items-center ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              {/* Dot on the line */}
              <div className="timeline-dot absolute left-1/2 -translate-x-1/2 z-10">
                <div className="w-4 h-4 rounded-full bg-papaya border-2 border-carbon" />
                <div className="absolute inset-0 rounded-full bg-papaya/30 animate-ping" />
              </div>

              {/* Content card */}
              <div
                className={`w-5/12 p-6 rounded-xl border border-white/5 bg-carbon-light/50 backdrop-blur-sm ${
                  i % 2 === 0 ? "text-right mr-auto" : "text-left ml-auto"
                }`}
              >
                <span
                  className="text-papaya text-3xl font-bold block mb-1"
                  style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
                >
                  {item.year}
                </span>
                <h3
                  className="text-xl mb-1"
                  style={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.event}
                </h3>
                <p className="text-smoke-dark text-sm">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
