"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
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
          duration: 2,
          ease: "power2.out",
          onUpdate: () => setDisplay(Math.round(obj.val)),
        });
      },
    });
  }, [value]);

  return (
    <div ref={ref}>
      <div style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1 }}>
        {display}<span style={{ color: "var(--accent)" }}>{suffix}</span>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "8rem 4rem", position: "relative", zIndex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", maxWidth: "1100px" }}>
        <div>
          <span data-reveal className="label" style={{ color: "var(--accent)" }}>About</span>
          <h2 data-reveal className="display-large" style={{ marginTop: "0.5rem", marginBottom: "2rem" }}>
            We are<br /><span className="accent-text">Void.</span>
          </h2>
          <p data-reveal className="body-text" style={{ marginBottom: "1.5rem" }}>
            Founded in 2019, we&apos;re a collective of designers, developers,
            and creative technologists who believe the web should be an art form.
          </p>
          <p data-reveal className="body-text">
            We partner with brands who refuse to be ordinary. Every project
            is an opportunity to push the boundaries of what digital can be.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem", justifyContent: "center" }}>
          <div data-reveal>
            <AnimatedNumber value={47} suffix="+" />
            <span className="label" style={{ marginTop: "0.5rem", display: "block" }}>Projects Delivered</span>
          </div>
          <div data-reveal>
            <AnimatedNumber value={12} suffix="" />
            <span className="label" style={{ marginTop: "0.5rem", display: "block" }}>Awards Won</span>
          </div>
          <div data-reveal>
            <AnimatedNumber value={8} suffix="" />
            <span className="label" style={{ marginTop: "0.5rem", display: "block" }}>Team Members</span>
          </div>
        </div>
      </div>
    </section>
  );
}
