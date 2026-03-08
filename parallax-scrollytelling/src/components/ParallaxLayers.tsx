"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxLayers() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const layers = sectionRef.current.querySelectorAll(".parallax-layer");

    layers.forEach((layer, i) => {
      const speed = (i + 1) * 100;
      gsap.to(layer, {
        y: -speed,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Text reveal
    gsap.from(textRef.current.querySelectorAll(".reveal-line"), {
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",
        end: "top 40%",
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-full relative"
      style={{ minHeight: "150vh" }}
    >
      {/* Geometric parallax layers */}
      <div
        className="parallax-layer absolute w-64 h-64 border border-indigo-500/20 rounded-3xl rotate-12"
        style={{ top: "10%", left: "5%", transform: "rotate(12deg)" }}
      />
      <div
        className="parallax-layer absolute w-48 h-48 border border-purple-500/20 rounded-full"
        style={{ top: "30%", right: "10%" }}
      />
      <div
        className="parallax-layer absolute w-96 h-96 border border-pink-500/10 rounded-3xl -rotate-6"
        style={{ bottom: "10%", left: "20%", transform: "rotate(-6deg)" }}
      />
      <div
        className="parallax-layer absolute w-32 h-32 bg-indigo-500/5 rounded-2xl rotate-45"
        style={{ top: "50%", right: "25%", transform: "rotate(45deg)" }}
      />
      <div
        className="parallax-layer absolute w-20 h-20 bg-purple-500/10 rounded-full"
        style={{ top: "70%", left: "40%" }}
      />

      {/* Content */}
      <div ref={textRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="overflow-hidden">
          <p className="reveal-line text-lg md:text-xl text-indigo-400 uppercase tracking-widest mb-4">
            Chapter 01
          </p>
        </div>
        <div className="overflow-hidden">
          <h2 className="reveal-line text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Depth Through
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 className="reveal-line text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Parallax
          </h2>
        </div>
        <div className="overflow-hidden">
          <p className="reveal-line mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Elements move at different speeds based on their distance from the
            viewer, creating an illusion of three-dimensional depth on a flat
            screen.
          </p>
        </div>
      </div>
    </section>
  );
}
