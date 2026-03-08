"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AnimatedStat({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration: 2.5,
          ease: "power2.out",
          onUpdate: () => setDisplay(Math.round(obj.val)),
        });
      },
    });
  }, [value]);

  return (
    <div ref={ref} className="story-stat">
      <div className="story-stat-value">{display.toLocaleString()}</div>
      <div className="story-stat-label">{label}</div>
    </div>
  );
}

export default function Chapter3() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    });
  }, []);

  return (
    <section id="chapter-3" ref={sectionRef} style={{ padding: "6rem 0 10rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        <div data-reveal>
          <div className="chapter-marker sans-small">
            <span>Chapter Three</span>
          </div>
          <h2 className="serif-medium" style={{ marginTop: "1.5rem" }}>
            The Revelation
          </h2>
        </div>

        <p data-reveal className="serif-body" style={{ marginTop: "2rem", marginBottom: "3rem" }}>
          The device was not a weapon, nor a tomb, nor a temple. It was a message.
          Encoded in crystal lattice and magnetic stone, left by hands that shaped
          the very bedrock of the continent, was a record of everything they had been.
        </p>

        {/* Full-width atmospheric image */}
        <div
          data-reveal
          style={{
            margin: "4rem -4rem",
            height: "70vh",
            background: "linear-gradient(180deg, var(--chapter-3), #051515, #0a0a0a)",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Crystal lattice visualization */}
          <svg viewBox="0 0 400 400" style={{ width: "300px", height: "300px", opacity: 0.4 }}>
            {/* Hexagonal lattice */}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <line
                key={angle}
                x1="200"
                y1="200"
                x2={200 + 150 * Math.cos((angle * Math.PI) / 180)}
                y2={200 + 150 * Math.sin((angle * Math.PI) / 180)}
                stroke="var(--accent)"
                strokeWidth="0.5"
              />
            ))}
            <circle cx="200" cy="200" r="50" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="var(--accent)" strokeWidth="0.3" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="var(--accent)" strokeWidth="0.2" />
            <circle cx="200" cy="200" r="8" fill="var(--accent)" opacity="0.5" />
          </svg>

          <div style={{ position: "absolute", bottom: "2rem", textAlign: "center", width: "100%" }}>
            <span className="sans-small" style={{ color: "var(--accent)", fontSize: "0.625rem" }}>
              Fig. 3 &mdash; Reconstructed lattice pattern from the device
            </span>
          </div>
        </div>

        <p data-reveal className="serif-body" style={{ margin: "3rem 0" }}>
          A civilization that had mapped the genome, calculated the age of stars,
          and built structures that would outlast continents &mdash; all before the
          first pyramid rose from Egyptian sand.
        </p>

        {/* Stats */}
        <div
          data-reveal
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "3rem",
            margin: "4rem 0",
            padding: "3rem 0",
            borderTop: "1px solid rgba(200,149,108,0.1)",
            borderBottom: "1px solid rgba(200,149,108,0.1)",
          }}
        >
          <AnimatedStat value={4200} label="Years Old" />
          <AnimatedStat value={847} label="Crystal Records" />
          <AnimatedStat value={12} label="Lost Languages" />
        </div>

        <div data-reveal className="quote-block" style={{ margin: "4rem 0" }}>
          <p>
            &ldquo;They did not disappear. They transcended. And they left the door open
            for those brave enough to follow.&rdquo;
          </p>
          <span className="sans-small" style={{ display: "block", marginTop: "1rem", color: "var(--text-muted)" }}>
            &mdash; Final entry, Vasquez Field Journal
          </span>
        </div>

        <div className="story-divider">
          <span className="sans-small" style={{ fontSize: "0.625rem" }}>&#9830;</span>
        </div>
      </div>
    </section>
  );
}
