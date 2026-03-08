"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "10rem 4rem 4rem",
        position: "relative",
        zIndex: 1,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <span data-reveal className="label" style={{ color: "var(--accent)" }}>Get in Touch</span>
        <h2 data-reveal className="display-huge" style={{ marginTop: "1rem", maxWidth: "900px" }}>
          Let&apos;s create<br />
          something <span className="accent-text">together.</span>
        </h2>

        <div data-reveal style={{ marginTop: "3rem" }}>
          <button className="mag-btn">
            <span>Start a project</span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: "relative", zIndex: 1 }}>
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        data-reveal
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: "4rem",
          borderTop: "1px solid var(--border)",
          marginTop: "6rem",
        }}
      >
        <div>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
            Void<span className="accent-text">.</span>
          </p>
          <p className="body-text" style={{ fontSize: "0.875rem" }}>
            Design Lab Experiment &mdash; Creative Studio
          </p>
        </div>

        <div style={{ display: "flex", gap: "3rem" }}>
          {["Instagram", "Twitter/X", "Dribbble", "LinkedIn"].map((social) => (
            <span
              key={social}
              className="label"
              style={{ cursor: "pointer", transition: "color 0.3s" }}
            >
              {social}
            </span>
          ))}
        </div>

        <span className="label">&copy; 2026</span>
      </div>
    </section>
  );
}
