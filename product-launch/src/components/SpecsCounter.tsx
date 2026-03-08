"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const specs = [
  { value: 32, suffix: "-core", label: "CPU" },
  { value: 80, suffix: "-core", label: "GPU" },
  { value: 192, suffix: "GB", label: "Unified Memory" },
  { value: 22, suffix: "hr", label: "Battery Life" },
  { value: 2000, suffix: " nits", label: "Peak Brightness" },
  { value: 5.7, suffix: "mm", label: "Thickness", decimals: 1 },
];

function AnimatedCounter({
  value,
  suffix,
  label,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}) {
  const counterRef = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;

    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            setDisplay(decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val).toString());
          },
        });
      },
    });
  }, [value, decimals]);

  return (
    <div ref={counterRef} style={{ textAlign: "center" }}>
      <div className="spec-value gradient-text">
        {display}
        <span style={{ fontSize: "0.5em" }}>{suffix}</span>
      </div>
      <div className="spec-label">{label}</div>
    </div>
  );
}

export default function SpecsCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    gsap.from(headingRef.current, {
      opacity: 0,
      y: 40,
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 80%",
        end: "top 60%",
        scrub: true,
      },
    });
  }, []);

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
      <h2 ref={headingRef} className="headline-medium" style={{ textAlign: "center", marginBottom: "5rem" }}>
        Performance that speaks<br />
        <span className="gradient-text">in numbers.</span>
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "4rem 6rem",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        {specs.map((spec, i) => (
          <AnimatedCounter key={i} {...spec} />
        ))}
      </div>
    </section>
  );
}
