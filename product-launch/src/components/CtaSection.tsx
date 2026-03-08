"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const els = section.querySelectorAll("[data-animate]");
    els.forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "top 65%",
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="buy"
      style={{
        padding: "10rem 2rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "linear-gradient(180deg, #000 0%, #0a0a1a 100%)",
      }}
    >
      <p
        data-animate
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--accent)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "1rem",
        }}
      >
        Starting at $1,599
      </p>

      <h2 data-animate className="headline-large" style={{ marginBottom: "1.5rem", maxWidth: "800px" }}>
        <span className="gradient-text">Studio Pro.</span><br />
        Get yours.
      </h2>

      <p data-animate className="body-large" style={{ maxWidth: "500px", marginBottom: "3rem" }}>
        Available in four stunning finishes. Free engraving. Free delivery.
      </p>

      <div data-animate style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <a href="#" className="cta-button">
          Pre-order now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a href="#" className="cta-button outline">
          Learn more
        </a>
      </div>

      {/* Ambient gradient */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(41,151,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Footer */}
      <div
        data-animate
        style={{
          position: "absolute",
          bottom: "2rem",
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
        }}
      >
        Design Lab Experiment — Product Launch
      </div>
    </section>
  );
}
