"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const views = [
  { label: "Front View", angle: "0deg", gradient: "linear-gradient(135deg, #1a0010, #0a0020)" },
  { label: "Side Profile", angle: "90deg", gradient: "linear-gradient(135deg, #100a00, #001a1a)" },
  { label: "Keyboard Detail", angle: "45deg", gradient: "linear-gradient(135deg, #001a00, #0a000a)" },
  { label: "Rear Exhaust", angle: "180deg", gradient: "linear-gradient(135deg, #1a1a00, #000a1a)" },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Horizontal scroll
    const totalWidth = track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ overflow: "hidden", position: "relative", zIndex: 1 }}>
      <div
        ref={trackRef}
        style={{ display: "flex", height: "100vh", alignItems: "center", padding: "0 4rem", gap: "2rem" }}
      >
        {/* First card is a title */}
        <div style={{ flexShrink: 0, width: "400px", padding: "2rem" }}>
          <span className="mono-text" style={{ color: "var(--neon-cyan)" }}>// 360&deg; VIEW</span>
          <h2 className="display-large" style={{ marginTop: "1rem" }}>
            EVERY<br />
            <span className="neon-glow-cyan">ANGLE</span>
          </h2>
          <p style={{ color: "var(--text-dim)", marginTop: "1rem", lineHeight: 1.8 }}>
            Precision-engineered from every perspective. Swipe to explore the machine.
          </p>
        </div>

        {views.map((view, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: "500px",
              height: "70vh",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: view.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Abstract laptop from different angle */}
              <div
                style={{
                  width: "200px",
                  height: "140px",
                  background: "linear-gradient(135deg, #1a1a1a, #0a0a0a)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transform: `rotateY(${view.angle}) rotateX(10deg)`,
                  transformStyle: "preserve-3d",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  position: "relative",
                }}
              >
                {/* RGB strip */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    left: "10%",
                    right: "10%",
                    height: "2px",
                    background: "linear-gradient(90deg, var(--neon-red), var(--neon-cyan), var(--neon-green))",
                    borderRadius: "1px",
                    boxShadow: "0 0 10px var(--neon-red)",
                  }}
                />
              </div>

              {/* Label */}
              <div style={{ position: "absolute", bottom: "2rem", left: "2rem" }}>
                <span className="mono-text" style={{ color: "var(--neon-red)" }}>
                  VIEW {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.5rem" }}>{view.label}</p>
              </div>

              {/* Corner marks */}
              <div style={{ position: "absolute", top: "1rem", left: "1rem", width: "20px", height: "20px", borderTop: "1px solid var(--neon-red)", borderLeft: "1px solid var(--neon-red)", opacity: 0.4 }} />
              <div style={{ position: "absolute", top: "1rem", right: "1rem", width: "20px", height: "20px", borderTop: "1px solid var(--neon-red)", borderRight: "1px solid var(--neon-red)", opacity: 0.4 }} />
              <div style={{ position: "absolute", bottom: "1rem", left: "1rem", width: "20px", height: "20px", borderBottom: "1px solid var(--neon-red)", borderLeft: "1px solid var(--neon-red)", opacity: 0.4 }} />
              <div style={{ position: "absolute", bottom: "1rem", right: "1rem", width: "20px", height: "20px", borderBottom: "1px solid var(--neon-red)", borderRight: "1px solid var(--neon-red)", opacity: 0.4 }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
