"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const colors = [
  { name: "Midnight", bg: "#1d1d1f", accent: "#3a3a3c", ring: "rgba(255,255,255,0.1)" },
  { name: "Silver", bg: "#e3e3e8", accent: "#c8c8cc", ring: "rgba(0,0,0,0.1)" },
  { name: "Space Black", bg: "#2a2a2c", accent: "#48484a", ring: "rgba(255,255,255,0.08)" },
  { name: "Starlight", bg: "#f0e8d8", accent: "#d4c8b0", ring: "rgba(0,0,0,0.08)" },
];

export default function ColorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeColor, setActiveColor] = useState(0);
  const productRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.from(sectionRef.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "top 50%",
        scrub: true,
      },
    });
  }, []);

  useEffect(() => {
    const product = productRef.current;
    const name = nameRef.current;
    if (!product || !name) return;

    gsap.to(product, {
      scale: 0.95,
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        gsap.to(product, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" });
      },
    });

    gsap.to(name, {
      opacity: 0,
      y: -10,
      duration: 0.15,
      onComplete: () => {
        gsap.to(name, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
      },
    });
  }, [activeColor]);

  const color = colors[activeColor];

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "8rem 2rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 className="headline-medium" style={{ textAlign: "center", marginBottom: "1rem" }}>
        Find your color.
      </h2>
      <p ref={nameRef} className="body-large" style={{ textAlign: "center", marginBottom: "3rem", fontSize: "1.2rem" }}>
        {color.name}
      </p>

      {/* Product in selected color */}
      <div ref={productRef} style={{ marginBottom: "3rem", position: "relative" }}>
        <div
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, ${color.accent}, ${color.bg} 70%)`,
            boxShadow: `0 40px 80px rgba(0,0,0,0.4), inset 0 2px 4px ${color.ring}`,
            transition: "background 0.5s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: `1px solid ${color.ring}`,
          }}
        />
      </div>

      {/* Color chips */}
      <div style={{ display: "flex", gap: "1rem" }}>
        {colors.map((c, i) => (
          <button
            key={i}
            className={`color-chip ${i === activeColor ? "active" : ""}`}
            style={{ background: c.bg, borderColor: i === activeColor ? "white" : "rgba(255,255,255,0.2)" }}
            onClick={() => setActiveColor(i)}
            aria-label={c.name}
          />
        ))}
      </div>
    </section>
  );
}
