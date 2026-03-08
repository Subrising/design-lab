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

    gsap.from(section.querySelectorAll("[data-anim]"), {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 70%", once: true },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-full"
      style={{ position: "relative", zIndex: 1, textAlign: "center" }}
    >
      <div>
        <span data-anim className="mono-text" style={{ color: "var(--neon-red)" }}>
          // AVAILABLE NOW
        </span>

        <h2 data-anim className="display-massive glitch neon-glow-red" data-text="$3,499" style={{ margin: "1.5rem 0" }}>
          $3,499
        </h2>

        <p data-anim style={{ color: "var(--text-dim)", maxWidth: "500px", margin: "0 auto 3rem", lineHeight: 1.8 }}>
          The Vortex X1 is available in Eclipse Black and Phantom White.
          Free expedited shipping. 3-year warranty included.
        </p>

        <div data-anim style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button className="cyber-btn">
            Order Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button className="cyber-btn cyan">
            Compare Models
          </button>
        </div>

        {/* Bottom decoration */}
        <div
          data-anim
          style={{
            marginTop: "6rem",
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
          }}
        >
          {["2yr Warranty", "Free Shipping", "RGB Customizable", "VR Ready"].map((item) => (
            <span key={item} className="mono-text" style={{ fontSize: "0.6rem" }}>
              <span style={{ color: "var(--neon-green)" }}>&#x2713;</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.65rem",
          color: "var(--text-dim)",
        }}
      >
        Design Lab Experiment — Dark Machine
      </div>
    </section>
  );
}
