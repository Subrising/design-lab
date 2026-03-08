"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cases = [
  {
    title: "Nebula Labs",
    category: "Brand / WebGL",
    year: "2026",
    gradient: "linear-gradient(135deg, #1a0a30, #2d1060, #0a1a40)",
    size: "large",
  },
  {
    title: "Kinetic Audio",
    category: "Interactive / Sound",
    year: "2025",
    gradient: "linear-gradient(135deg, #0a2a1a, #103820, #051510)",
    size: "small",
  },
  {
    title: "Arc Finance",
    category: "UI / Motion",
    year: "2025",
    gradient: "linear-gradient(135deg, #2a1a0a, #3d2810, #1a0a00)",
    size: "small",
  },
  {
    title: "Phantom VR",
    category: "WebXR / 3D",
    year: "2026",
    gradient: "linear-gradient(135deg, #0a0a2a, #151540, #050520)",
    size: "large",
  },
];

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Heading
    if (headingRef.current) {
      gsap.from(headingRef.current.querySelectorAll("[data-anim]"), {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 80%", once: true },
      });
    }

    // Cards
    section.querySelectorAll(".case-card").forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 80,
        scale: 0.95,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 85%", once: true },
      });

      // 3D tilt on hover
      const inner = card.querySelector(".case-card-inner") as HTMLElement;
      if (!inner) return;

      card.addEventListener("mousemove", (e: Event) => {
        const me = e as MouseEvent;
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = ((me.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((me.clientY - rect.top) / rect.height - 0.5) * -10;
        gsap.to(inner, { rotateY: x, rotateX: y, duration: 0.4, ease: "power2.out" });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(inner, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power2.out" });
      });
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "8rem 4rem", position: "relative", zIndex: 1 }}>
      <div ref={headingRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
        <div>
          <span data-anim className="label" style={{ color: "var(--accent)" }}>Selected Work</span>
          <h2 data-anim className="display-large" style={{ marginTop: "0.5rem" }}>Case Studies</h2>
        </div>
        <span data-anim className="label">(04)</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2rem",
          maxWidth: "1200px",
        }}
      >
        {cases.map((c, i) => (
          <div
            key={i}
            className="case-card"
            style={{
              height: c.size === "large" ? "600px" : "400px",
              perspective: "1000px",
            }}
          >
            <div className="case-card-inner" style={{ transformStyle: "preserve-3d" }}>
              <div
                className="case-card-bg"
                style={{
                  background: c.gradient,
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                {/* Abstract geometric element */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "150px",
                    height: "150px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: i % 2 === 0 ? "50%" : "0",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                    border: "1px solid rgba(200,255,0,0.1)",
                    borderRadius: i % 2 === 0 ? "0" : "50%",
                  }}
                />
              </div>

              <div className="case-card-overlay">
                <span className="label" style={{ marginBottom: "0.5rem" }}>{c.category}</span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <h3 className="display-medium">{c.title}</h3>
                  <span className="label">{c.year}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
