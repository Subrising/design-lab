"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const specs = [
  { label: "GPU", value: "RTX 5090", bar: 98, color: "var(--neon-red)", detail: "24GB GDDR7 / 2.5 GHz Boost" },
  { label: "CPU", value: "i9-15900HX", bar: 95, color: "var(--neon-cyan)", detail: "24 Cores / 5.8 GHz Turbo" },
  { label: "RAM", value: "64GB DDR5", bar: 85, color: "var(--neon-green)", detail: "5600MHz / Dual Channel" },
  { label: "STORAGE", value: "4TB NVMe", bar: 90, color: "var(--neon-purple)", detail: "Gen5 / 14,000 MB/s Read" },
  { label: "DISPLAY", value: "QHD+ 240Hz", bar: 92, color: "var(--neon-red)", detail: "16\" / Mini-LED / HDR 1000" },
  { label: "COOLING", value: "Vapor Chamber", bar: 88, color: "var(--neon-cyan)", detail: "Liquid Metal / 5 Heatpipes" },
];

function AnimatedBar({ bar, color, triggered }: { bar: number; color: string; triggered: boolean }) {
  return (
    <div className="spec-bar" style={{ marginTop: "0.75rem" }}>
      <div
        className="spec-bar-fill"
        style={{
          width: triggered ? `${bar}%` : "0%",
          background: `linear-gradient(90deg, ${color}44, ${color})`,
          boxShadow: `0 0 10px ${color}66`,
        }}
      />
    </div>
  );
}

export default function SpecsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Heading
    gsap.from(section.querySelectorAll("[data-head]"), {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 70%", once: true },
    });

    // Trigger bars
    ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      once: true,
      onEnter: () => setTriggered(true),
    });

    // Cards
    gsap.from(section.querySelectorAll(".spec-card"), {
      opacity: 0,
      y: 40,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 60%", once: true },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "8rem 4rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <span data-head className="mono-text" style={{ color: "var(--neon-red)" }}>
          // TECHNICAL SPECIFICATIONS
        </span>
        <h2 data-head className="display-large" style={{ marginTop: "1rem" }}>
          <span className="neon-glow-red">RAW</span> POWER
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {specs.map((spec, i) => (
          <div key={i} className="spec-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="mono-text" style={{ color: spec.color, fontSize: "0.65rem" }}>{spec.label}</span>
              <span className="mono-text" style={{ fontSize: "0.6rem" }}>{spec.bar}%</span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "0.75rem" }}>{spec.value}</div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>{spec.detail}</p>
            <AnimatedBar bar={spec.bar} color={spec.color} triggered={triggered} />
          </div>
        ))}
      </div>
    </section>
  );
}
