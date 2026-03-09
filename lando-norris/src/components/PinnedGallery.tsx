"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const moments = [
  {
    year: "2024",
    title: "MAIDEN VICTORY",
    description: "First Formula 1 win at the Miami Grand Prix — a moment that defined a career.",
    gradient: "from-papaya/20 to-transparent",
    accent: "#FF8000",
  },
  {
    year: "2024",
    title: "CHAMPIONSHIP BATTLE",
    description: "Taking the fight all the way — podium after podium, relentless pace.",
    gradient: "from-mclaren-blue/20 to-transparent",
    accent: "#0090FF",
  },
  {
    year: "2025",
    title: "THE FUTURE",
    description: "Every season brings new challenges. Every race, a chance to make history.",
    gradient: "from-papaya/20 to-transparent",
    accent: "#FF8000",
  },
];

export default function PinnedGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Each panel pins and reveals
      panelsRef.current.forEach((panel, i) => {
        if (!panel) return;

        const content = panel.querySelector(".panel-content");
        const number = panel.querySelector(".panel-number");
        const title = panel.querySelector(".panel-title");
        const desc = panel.querySelector(".panel-desc");
        const line = panel.querySelector(".panel-line");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 60%",
            end: "top 20%",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          content,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );

        tl.fromTo(
          number,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 0.1, duration: 0.6, ease: "back.out(2)" },
          "-=0.5"
        );

        tl.fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
          "-=0.4"
        );

        tl.fromTo(
          title,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        );

        tl.fromTo(
          desc,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-4">
      <h2
        ref={headingRef}
        className="text-center mb-20"
        style={{
          fontSize: "clamp(32px, 6vw, 80px)",
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          letterSpacing: "0.05em",
        }}
      >
        KEY{" "}
        <span className="text-papaya">MOMENTS</span>
      </h2>

      <div className="max-w-5xl mx-auto space-y-32">
        {moments.map((moment, i) => (
          <div
            key={i}
            ref={(el) => { if (el) panelsRef.current[i] = el; }}
            className="relative"
          >
            {/* Background number */}
            <div
              className="panel-number absolute -top-8 -left-4 select-none pointer-events-none"
              style={{
                fontSize: "clamp(120px, 20vw, 300px)",
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                color: moment.accent,
                opacity: 0.1,
                lineHeight: 0.8,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>

            <div className="panel-content relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Visual card */}
              <div
                className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${moment.gradient} border border-white/5 flex items-center justify-center relative overflow-hidden`}
              >
                {/* Abstract racing visual */}
                <div className="absolute inset-0">
                  <svg viewBox="0 0 400 300" className="w-full h-full opacity-30">
                    <path
                      d={
                        i === 0
                          ? "M0 150 Q100 50 200 150 Q300 250 400 150"
                          : i === 1
                          ? "M0 200 Q100 100 200 200 Q300 100 400 200"
                          : "M0 100 Q200 300 400 100"
                      }
                      fill="none"
                      stroke={moment.accent}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span
                  className="text-6xl md:text-8xl font-bold relative z-10"
                  style={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    color: moment.accent,
                    opacity: 0.4,
                  }}
                >
                  {moment.year}
                </span>
              </div>

              {/* Text content */}
              <div>
                <div
                  className="panel-line mb-4 origin-left"
                  style={{
                    width: "60px",
                    height: "3px",
                    background: moment.accent,
                  }}
                />
                <h3
                  className="panel-title mb-4"
                  style={{
                    fontSize: "clamp(28px, 4vw, 48px)",
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    letterSpacing: "0.02em",
                  }}
                >
                  {moment.title}
                </h3>
                <p className="panel-desc text-smoke-dark text-lg leading-relaxed">
                  {moment.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
