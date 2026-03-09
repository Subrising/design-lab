"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function MotionPathSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // The racing line SVG path that the car follows
      const path = "#racingLine";

      // Animate the trail drawing
      if (trailRef.current) {
        const length = trailRef.current.getTotalLength();
        gsap.set(trailRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(trailRef.current, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            end: "bottom 50%",
            scrub: 1,
          },
        });
      }

      // Car follows the motion path on scroll
      if (carRef.current) {
        gsap.to(carRef.current, {
          motionPath: {
            path: path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            end: "bottom 50%",
            scrub: 1,
          },
        });
      }

      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Text reveal
      gsap.fromTo(
        textRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] py-24 overflow-hidden"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <div className="relative z-10">
            <h2
              ref={headingRef}
              className="mb-6"
              style={{
                fontSize: "clamp(36px, 5vw, 72px)",
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                letterSpacing: "0.02em",
                lineHeight: 1,
              }}
            >
              THE{" "}
              <span className="text-papaya">RACING</span>
              <br />
              LINE
            </h2>
            <p
              ref={textRef}
              className="text-smoke-dark text-lg max-w-md leading-relaxed"
            >
              Every corner is an opportunity. Every apex, a fraction of a second
              gained. The perfect racing line is an art — precision at 300km/h.
            </p>
          </div>

          {/* SVG motion path side */}
          <div className="relative">
            <svg
              ref={svgRef}
              viewBox="0 0 600 500"
              className="w-full h-auto"
              style={{ filter: "drop-shadow(0 0 20px rgba(255, 128, 0, 0.2))" }}
            >
              {/* Track outline */}
              <path
                d="M 100 400 Q 50 300 100 200 Q 150 100 300 80 Q 450 60 500 150 Q 550 240 480 320 Q 410 400 300 420 Q 190 440 100 400"
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="40"
                strokeLinecap="round"
              />

              {/* Racing line (animated) */}
              <path
                ref={trailRef}
                id="racingLine"
                d="M 100 400 Q 50 300 100 200 Q 150 100 300 80 Q 450 60 500 150 Q 550 240 480 320 Q 410 400 300 420 Q 190 440 100 400"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Apex markers */}
              {[
                { cx: 100, cy: 200 },
                { cx: 300, cy: 80 },
                { cx: 500, cy: 150 },
                { cx: 480, cy: 320 },
                { cx: 300, cy: 420 },
              ].map((point, i) => (
                <g key={i}>
                  <circle
                    cx={point.cx}
                    cy={point.cy}
                    r="6"
                    fill="#FF8000"
                    opacity="0.6"
                  />
                  <circle
                    cx={point.cx}
                    cy={point.cy}
                    r="12"
                    fill="none"
                    stroke="#FF8000"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                </g>
              ))}

              {/* Gradient definition */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF8000" />
                  <stop offset="50%" stopColor="#FFB366" />
                  <stop offset="100%" stopColor="#0090FF" />
                </linearGradient>
              </defs>
            </svg>

            {/* Car element that follows the path */}
            <div
              ref={carRef}
              className="absolute top-0 left-0 z-20"
              style={{ width: 0, height: 0 }}
            >
              <div
                className="relative -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: "24px",
                  height: "24px",
                }}
              >
                {/* Car glow */}
                <div className="absolute inset-0 rounded-full bg-papaya blur-md opacity-60" />
                {/* Car dot */}
                <div className="absolute inset-1 rounded-full bg-papaya" />
                {/* Speed trail */}
                <div
                  className="absolute top-1/2 right-full -translate-y-1/2"
                  style={{
                    width: "40px",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, #FF8000)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
