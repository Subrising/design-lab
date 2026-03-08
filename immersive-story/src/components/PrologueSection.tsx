"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PrologueSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!section || !title || !subtitle) return;

    // Entrance
    const tl = gsap.timeline({ delay: 0.8 });
    tl.from(title, { y: 80, opacity: 0, duration: 1.5, ease: "power4.out" })
      .from(subtitle, { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8");

    // Parallax
    gsap.to(title, {
      y: -120,
      scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
    });

    gsap.to(section.querySelector(".parallax-bg"), {
      y: 100,
      scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
    });
  }, []);

  return (
    <section
      id="prologue"
      ref={sectionRef}
      className="full-bleed"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {/* Background */}
      <div
        className="parallax-bg"
        style={{
          background: "linear-gradient(180deg, #0a1520 0%, #1a2a35 30%, #0c1a28 60%, #050a10 100%)",
        }}
      >
        {/* Stars */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              borderRadius: "50%",
              background: "white",
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.4,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div
        className="full-bleed-overlay"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6))" }}
      />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 2rem" }}>
        <div className="chapter-marker sans-small" style={{ justifyContent: "center", marginBottom: "2rem" }}>
          <span>A Design Lab Story</span>
        </div>

        <h1 ref={titleRef} className="serif-display" style={{ color: "var(--accent-light)" }}>
          The Lost City<br />of Meridian
        </h1>

        <p ref={subtitleRef} className="serif-body" style={{ maxWidth: "500px", margin: "2rem auto 0" }}>
          In 1924, an expedition vanished into the Peruvian highlands,
          chasing whispers of a civilization older than time itself.
        </p>

        <div style={{ marginTop: "4rem" }}>
          <span className="sans-small" style={{ color: "var(--text-muted)" }}>Scroll to begin</span>
          <div
            style={{
              width: "1px",
              height: "60px",
              background: "linear-gradient(180deg, var(--accent), transparent)",
              margin: "1rem auto 0",
              animation: "scrollFade 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes scrollFade {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.3; transform: scaleY(0.5); }
        }
      `}</style>
    </section>
  );
}
