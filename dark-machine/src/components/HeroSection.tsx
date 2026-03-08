"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!section || !title || !subtitle) return;

    // Boot sequence entrance
    const tl = gsap.timeline({ delay: 0.5 });

    tl.from(title, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power4.out",
    })
      .from(subtitle.querySelectorAll("[data-anim]"), {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.3");

    // Parallax
    gsap.to(title, {
      y: -150,
      opacity: 0,
      scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
    });
  }, []);

  return (
    <section ref={sectionRef} className="section-full" style={{ position: "relative", zIndex: 1 }}>
      {/* Corner decorations */}
      <div style={{ position: "absolute", top: "2rem", left: "2rem" }}>
        <span className="mono-text" style={{ color: "var(--neon-red)" }}>SYS://DARK_MACHINE</span>
      </div>
      <div style={{ position: "absolute", top: "2rem", right: "2rem" }}>
        <span className="mono-text">BUILD 2026.03.09</span>
      </div>
      <div style={{ position: "absolute", bottom: "2rem", left: "2rem" }}>
        <span className="mono-text">STATUS: <span style={{ color: "var(--neon-green)" }}>ONLINE</span></span>
      </div>

      <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="mono-text" style={{ color: "var(--neon-red)", fontSize: "0.7rem" }}>
            [ NEXT GEN PERFORMANCE ]
          </span>
        </div>

        <h1
          ref={titleRef}
          className="display-massive glitch neon-glow-red"
          data-text="VORTEX X1"
        >
          VORTEX X1
        </h1>

        <div ref={subtitleRef} style={{ marginTop: "2rem" }}>
          <p data-anim className="mono-text" style={{ fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
            UNLEASH THE BEAST WITHIN
          </p>
          <p data-anim className="mono-text">
            RTX 5090 / i9-15900HX / 64GB DDR5 / 240Hz QHD+
          </p>

          <div data-anim style={{ marginTop: "3rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="cyber-btn">
              Configure
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="cyber-btn cyan">
              Specs
            </button>
          </div>
        </div>
      </div>

      {/* Diagonal neon line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "20%",
          width: "1px",
          height: "100%",
          background: "linear-gradient(180deg, transparent, var(--neon-red), transparent)",
          opacity: 0.15,
          transform: "rotate(15deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          width: "1px",
          height: "100%",
          background: "linear-gradient(180deg, transparent, var(--neon-cyan), transparent)",
          opacity: 0.1,
          transform: "rotate(-10deg)",
        }}
      />
    </section>
  );
}
