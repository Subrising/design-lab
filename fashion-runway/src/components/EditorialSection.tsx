"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EditorialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    if (!section || !image || !content) return;

    // Image clip-path reveal
    gsap.fromTo(
      image,
      { clipPath: "inset(100% 0 0 0)" },
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: { trigger: section, start: "top 60%", once: true },
      }
    );

    // Parallax on image
    gsap.to(image.querySelector(".parallax-inner"), {
      y: -80,
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
    });

    // Content stagger
    const items = content.querySelectorAll("[data-anim]");
    gsap.from(items, {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: content, start: "top 70%", once: true },
    });
  }, []);

  return (
    <section ref={sectionRef} className="editorial-grid">
      <div ref={imageRef} className="editorial-image" style={{ clipPath: "inset(100% 0 0 0)" }}>
        <div
          className="parallax-inner"
          style={{
            width: "100%",
            height: "120%",
            background: "linear-gradient(180deg, #1a1a2e 0%, #2d1b69 40%, #11111b 100%)",
            position: "relative",
          }}
        >
          {/* Abstract fashion silhouette */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "200px",
              height: "400px",
              background: "linear-gradient(180deg, rgba(232,197,71,0.2), transparent)",
              clipPath: "polygon(40% 0, 60% 0, 70% 30%, 75% 60%, 65% 100%, 35% 100%, 25% 60%, 30% 30%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "0.625rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Look 01
          </div>
        </div>
      </div>

      <div ref={contentRef} className="editorial-content">
        <span
          data-anim
          style={{
            fontSize: "0.625rem",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          The Collection
        </span>

        <div data-anim className="section-divider" style={{ margin: "1.5rem 0" }} />

        <h2 data-anim className="display-md" style={{ marginBottom: "2rem" }}>
          Where shadow<br />meets structure
        </h2>

        <p data-anim className="editorial-text">
          Drawing from the interplay of negative space and architectural form,
          SS26 reimagines the human silhouette through deconstructed tailoring
          and fluid geometry. Each piece exists at the intersection of restraint
          and expression.
        </p>

        <p data-anim className="editorial-text" style={{ marginTop: "1.5rem" }}>
          Fabricated from Japanese silk-wool blends and Italian technical cotton,
          the collection speaks to a generation that refuses to choose between
          comfort and conviction.
        </p>

        <div data-anim style={{ marginTop: "3rem" }}>
          <button className="magnetic-btn">
            View Lookbook
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
