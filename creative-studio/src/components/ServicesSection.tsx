"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  { num: "01", title: "Brand Strategy & Identity", desc: "Positioning, visual systems, brand architecture" },
  { num: "02", title: "Digital Design & UI", desc: "Web design, app interfaces, design systems" },
  { num: "03", title: "Motion & Animation", desc: "3D motion, micro-interactions, brand films" },
  { num: "04", title: "WebGL & Interactive", desc: "Three.js experiences, creative coding, installations" },
  { num: "05", title: "Creative Direction", desc: "Campaign concepts, art direction, content strategy" },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.from(section.querySelectorAll("[data-head]"), {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 70%", once: true },
    });

    section.querySelectorAll(".service-item").forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 85%", once: true },
        delay: i * 0.05,
      });
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "8rem 4rem", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
        <div>
          <span data-head className="label" style={{ color: "var(--accent)" }}>What We Do</span>
          <h2 data-head className="display-large" style={{ marginTop: "0.5rem" }}>Services</h2>
        </div>
      </div>

      <div style={{ maxWidth: "1000px" }}>
        {services.map((s, i) => (
          <div key={i} className="service-item">
            <span className="service-number">{s.num}</span>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 600 }}>{s.title}</h3>
            </div>
            <span className="body-text" style={{ fontSize: "0.875rem" }}>{s.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
