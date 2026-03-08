"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const looks = [
  { title: "Look 01", subtitle: "Oversized Tailoring", bg: "#1a1a2e" },
  { title: "Look 02", subtitle: "Fluid Draping", bg: "#2e1a1a" },
  { title: "Look 03", subtitle: "Structured Knit", bg: "#1a2e1a" },
  { title: "Look 04", subtitle: "Deconstructed Layer", bg: "#2e2e1a" },
  { title: "Look 05", subtitle: "Minimal Form", bg: "#1a2e2e" },
  { title: "Look 06", subtitle: "Sculptural Volume", bg: "#2e1a2e" },
];

export default function LookbookGrid() {
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

    // Grid items staggered reveal
    const items = section.querySelectorAll(".lookbook-item");
    items.forEach((item, i) => {
      gsap.fromTo(
        item,
        { clipPath: "inset(100% 0 0 0)", scale: 1.1 },
        {
          clipPath: "inset(0% 0 0 0)",
          scale: 1,
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            once: true,
          },
          delay: (i % 3) * 0.15,
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "8rem 0" }}>
      <div ref={headingRef} style={{ padding: "0 4rem", marginBottom: "4rem" }}>
        <span
          data-anim
          style={{
            fontSize: "0.625rem",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Runway
        </span>
        <h2 data-anim className="display-lg" style={{ marginTop: "1rem" }}>
          Lookbook
        </h2>
      </div>

      <div className="lookbook-grid">
        {looks.map((look, i) => (
          <div key={i} className="lookbook-item">
            <div
              className="lookbook-item-bg"
              style={{
                background: `linear-gradient(180deg, ${look.bg} 0%, #050505 100%)`,
                position: "relative",
              }}
            >
              {/* Abstract silhouette */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "40%",
                  height: "60%",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "2px",
                }}
              />
            </div>
            <div className="lookbook-overlay">
              <div>
                <p style={{ fontSize: "0.625rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>
                  {look.title}
                </p>
                <p style={{ fontSize: "1rem", fontWeight: 500, marginTop: "0.5rem" }}>{look.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
