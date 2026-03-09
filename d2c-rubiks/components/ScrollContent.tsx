"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const sections = [
  {
    title: "Precision Engineering",
    subtitle: "Every face, every rotation — engineered to perfection.",
    description:
      "Our approach to life science solutions mirrors the precision of a Rubik's cube. Each component interlocks with purpose, creating systems that move seamlessly together.",
    accent: "#c41e3a",
  },
  {
    title: "Molecular Innovation",
    subtitle: "Turning complexity into clarity.",
    description:
      "Like solving a cube, we break down molecular complexity into actionable insights. Our D2C platform transforms raw data into breakthrough discoveries.",
    accent: "#009b48",
  },
  {
    title: "Connected Systems",
    subtitle: "Six faces. One unified solution.",
    description:
      "Every face of our platform connects — research, development, manufacturing, distribution, analytics, and patient engagement — all rotating in harmony.",
    accent: "#0051ba",
  },
  {
    title: "The Algorithm",
    subtitle: "Systematic. Repeatable. Revolutionary.",
    description:
      "Just as there's an algorithm to solve any configuration, our platform provides systematic pathways from molecule to market, optimizing every step of the journey.",
    accent: "#ff5800",
  },
  {
    title: "Infinite Possibilities",
    subtitle: "43 quintillion combinations. One perfect solution.",
    description:
      "A Rubik's cube has 43,252,003,274,489,856,000 possible states. We navigate the complexity of life science with equal precision, finding the optimal path forward.",
    accent: "#ffd500",
  },
];

export default function ScrollContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = containerRef.current?.querySelectorAll(".scroll-section");
    sections?.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10">
      {sections.map((section, i) => (
        <div
          key={i}
          className="scroll-section min-h-screen flex items-center opacity-0 translate-y-16"
          style={{ paddingTop: i === 0 ? "100vh" : undefined }}
        >
          <div
            className={`max-w-xl mx-auto px-8 ${
              i % 2 === 0 ? "ml-auto mr-16 lg:mr-32 text-right" : "mr-auto ml-16 lg:ml-32 text-left"
            }`}
          >
            <div
              className="w-12 h-[2px] mb-6"
              style={{
                background: section.accent,
                marginLeft: i % 2 === 0 ? "auto" : undefined,
              }}
            />
            <p
              className="text-xs font-mono uppercase tracking-[0.3em] mb-3 opacity-50"
              style={{ color: section.accent }}
            >
              0{i + 1} — Feature
            </p>
            <h2 className="text-4xl lg:text-5xl font-light mb-4 text-glow leading-tight">
              {section.title}
            </h2>
            <p className="text-lg text-white/60 mb-6 font-light italic">
              {section.subtitle}
            </p>
            <p className="text-sm text-white/40 leading-relaxed max-w-md">
              {section.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
