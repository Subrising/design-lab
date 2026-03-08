"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const sub = subRef.current;
    if (!section || !title || !sub) return;

    // Staggered character entrance
    const tl = gsap.timeline({ delay: 0.5 });
    const lines = title.querySelectorAll(".line");
    lines.forEach((line) => {
      const chars = line.querySelectorAll(".char");
      tl.from(chars, {
        y: 120,
        rotateX: -80,
        opacity: 0,
        stagger: 0.03,
        duration: 1,
        ease: "power4.out",
      }, "-=0.7");
    });

    tl.from(sub.querySelectorAll("[data-anim]"), {
      y: 20,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.3");

    // Parallax
    gsap.to(title, {
      y: -200,
      opacity: 0,
      scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
    });
  }, []);

  const renderChars = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="char" style={{ display: "inline-block", willChange: "transform" }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "6rem 4rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: "1200px" }}>
        <h1 ref={titleRef} className="display-huge">
          <div className="line" style={{ overflow: "hidden" }}>
            {renderChars("We craft")}
          </div>
          <div className="line" style={{ overflow: "hidden" }}>
            {renderChars("digital ")}
            <span style={{ color: "var(--accent)" }}>{renderChars("experiences")}</span>
          </div>
        </h1>

        <div ref={subRef} style={{ marginTop: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <p data-anim className="body-text" style={{ maxWidth: "400px" }}>
            Void is an award-winning creative studio specializing in immersive
            digital experiences, brand identity, and interactive installations.
          </p>

          <div data-anim style={{ textAlign: "right" }}>
            <span className="label" style={{ color: "var(--accent)" }}>Based in</span>
            <p style={{ fontSize: "1rem", marginTop: "0.5rem" }}>Melbourne / Tokyo</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "4rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "bounce 2s ease-in-out infinite",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
        <span className="label">Scroll to explore</span>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </section>
  );
}
