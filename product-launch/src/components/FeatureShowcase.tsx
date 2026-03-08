"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "All-Day Battery",
    description: "Up to 22 hours of battery life. The longest ever in a Studio product.",
    gradient: "linear-gradient(135deg, #ff9500, #ff6723)",
  },
  {
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    title: "M4 Ultra Chip",
    description: "32-core CPU. 80-core GPU. The fastest neural engine ever created.",
    gradient: "linear-gradient(135deg, var(--accent), var(--accent-purple))",
  },
  {
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    title: "Cinematic Camera",
    description: "48MP fusion camera with Cinematic mode in 4K. Lidar-enhanced AR.",
    gradient: "linear-gradient(135deg, #30d158, #00c7be)",
  },
  {
    icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
    title: "Spatial Audio",
    description: "Six-speaker system with force-cancelling woofers and Dolby Atmos.",
    gradient: "linear-gradient(135deg, #bf4dff, #ff375f)",
  },
];

export default function FeatureShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;
    if (!section || !heading || !cards) return;

    gsap.from(heading, {
      opacity: 0,
      y: 60,
      scrollTrigger: {
        trigger: heading,
        start: "top 80%",
        end: "top 50%",
        scrub: true,
      },
    });

    const cardEls = cards.querySelectorAll(".feature-card");
    cardEls.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 80,
        scale: 0.95,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 55%",
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "8rem 0", minHeight: "100vh" }}>
      <h2
        ref={headingRef}
        className="headline-medium"
        style={{ textAlign: "center", marginBottom: "4rem", padding: "0 2rem" }}
      >
        Built different.<br />
        <span style={{ color: "var(--text-secondary)" }}>In every way that matters.</span>
      </h2>

      <div ref={cardsRef} className="feature-grid" style={{ margin: "0 auto" }}>
        {features.map((feature, i) => (
          <div key={i} className="feature-card">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: feature.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={feature.icon} />
              </svg>
            </div>
            <h3 className="headline-small" style={{ marginBottom: "0.75rem" }}>
              {feature.title}
            </h3>
            <p className="body-large" style={{ fontSize: "1rem" }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
