"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EpilogueSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    });

    // Background color shift
    gsap.to(section, {
      backgroundColor: "#0c0c0c",
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "center center",
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      id="epilogue"
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--chapter-4)",
        position: "relative",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "700px", padding: "0 2rem" }}>
        <div data-reveal className="chapter-marker sans-small" style={{ justifyContent: "center", marginBottom: "2rem" }}>
          <span>Epilogue</span>
        </div>

        <h2 data-reveal className="serif-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "var(--accent-light)", marginBottom: "2rem" }}>
          The door<br />remains open.
        </h2>

        <p data-reveal className="serif-body" style={{ maxWidth: "500px", margin: "0 auto 3rem" }}>
          Dr. Vasquez&apos;s journal was found in 1987, sealed in a copper cylinder
          at the base of the archway. The expedition was never seen again.
          But the coordinates on the tablet... they point to twelve more sites,
          scattered across six continents.
        </p>

        <p data-reveal className="serif-body" style={{ color: "var(--accent)", fontStyle: "italic" }}>
          The search continues.
        </p>

        <div data-reveal style={{ marginTop: "6rem" }}>
          <span className="sans-small" style={{ color: "var(--text-muted)", fontSize: "0.625rem" }}>
            Design Lab Experiment &mdash; Immersive Storytelling
          </span>
        </div>
      </div>
    </section>
  );
}
