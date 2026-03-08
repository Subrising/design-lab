"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.from(section.querySelectorAll("[data-anim]"), {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 80%", once: true },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "8rem 4rem 4rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "4rem",
          marginBottom: "6rem",
        }}
      >
        <div data-anim>
          <h3 className="display-md" style={{ marginBottom: "1.5rem" }}>
            Maison Noir
          </h3>
          <p className="editorial-text">
            Paris. Tokyo. New York.<br />
            Since 2019.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <button className="magnetic-btn">
              Newsletter
            </button>
          </div>
        </div>

        <div data-anim>
          <p style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.5rem" }}>
            Collections
          </p>
          {["SS26", "FW25", "Pre-Fall", "Resort", "Archive"].map((item) => (
            <p key={item} style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.75rem", cursor: "pointer" }}>
              {item}
            </p>
          ))}
        </div>

        <div data-anim>
          <p style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.5rem" }}>
            Brand
          </p>
          {["About", "Sustainability", "Careers", "Press", "Contact"].map((item) => (
            <p key={item} style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.75rem", cursor: "pointer" }}>
              {item}
            </p>
          ))}
        </div>

        <div data-anim>
          <p style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.5rem" }}>
            Follow
          </p>
          {["Instagram", "TikTok", "Pinterest", "Twitter/X"].map((item) => (
            <p key={item} style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.75rem", cursor: "pointer" }}>
              {item}
            </p>
          ))}
        </div>
      </div>

      <div
        data-anim
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
        }}
      >
        <span>Design Lab Experiment — Fashion Runway</span>
        <span>&copy; 2026 Maison Noir. All rights reserved.</span>
      </div>
    </section>
  );
}
