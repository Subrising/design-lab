"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!section || !title || !subtitle) return;

    // Entrance
    const tl = gsap.timeline({ delay: 0.5 });
    const chars = title.querySelectorAll(".char");
    tl.from(chars, {
      y: 120,
      rotateX: -90,
      opacity: 0,
      stagger: 0.04,
      duration: 1.2,
      ease: "power4.out",
    }).from(subtitle, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");

    // Parallax on scroll
    gsap.to(title, {
      y: -200,
      opacity: 0,
      scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
    });
  }, []);

  const brandName = "MAISON NOIR";
  const season = "SS26 Collection";

  return (
    <section ref={sectionRef} className="hero-section">
      <div className="hero-video-placeholder" />
      <div className="hero-bg" />

      {/* Parallax floating elements */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: "200px",
          height: "280px",
          background: "linear-gradient(135deg, rgba(232,197,71,0.08), transparent)",
          borderRadius: "2px",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "8%",
          width: "150px",
          height: "200px",
          border: "1px solid rgba(255,255,255,0.05)",
          zIndex: 0,
        }}
      />

      <div ref={overlayRef} style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "2rem",
          }}
        >
          {season}
        </p>

        <h1 ref={titleRef} className="display-xl" style={{ overflow: "hidden" }}>
          {brandName.split("").map((char, i) => (
            <span
              key={i}
              className="char"
              style={{ display: "inline-block", willChange: "transform" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          style={{
            marginTop: "2rem",
            fontSize: "0.875rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Redefining the silhouette
        </p>

        <div style={{ marginTop: "3rem" }}>
          <button className="magnetic-btn">
            Explore Collection
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(180deg, var(--accent), transparent)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.3; transform: scaleY(0.6); }
        }
      `}</style>
    </section>
  );
}
