"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Chapter1() {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlocksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const textBlocks = textBlocksRef.current;
    if (!section || !textBlocks) return;

    // Staggered text reveals
    const blocks = textBlocks.querySelectorAll("[data-reveal]");
    blocks.forEach((block) => {
      gsap.from(block, {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: block,
          start: "top 75%",
          once: true,
        },
      });
    });

    // Image parallax
    const images = section.querySelectorAll(".parallax-img");
    images.forEach((img) => {
      gsap.to(img, {
        y: -60,
        scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }, []);

  return (
    <section id="chapter-1" ref={sectionRef} style={{ padding: "10rem 0" }}>
      <div ref={textBlocksRef} style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Chapter header */}
        <div data-reveal style={{ marginBottom: "4rem" }}>
          <div className="chapter-marker sans-small">
            <span>Chapter One</span>
          </div>
          <h2 className="serif-medium" style={{ marginTop: "1.5rem" }}>
            The Discovery
          </h2>
        </div>

        <p data-reveal className="serif-body" style={{ marginBottom: "3rem" }}>
          Dr. Elena Vasquez found the first fragment in a dusty archive in Lima &mdash;
          a copper tablet inscribed with symbols that matched no known language.
          The patina suggested an age of three thousand years, yet the metallurgy
          was impossibly advanced.
        </p>

        {/* Inline image */}
        <div data-reveal style={{ margin: "4rem -4rem", position: "relative", height: "60vh", overflow: "hidden", borderRadius: "8px" }}>
          <div
            className="parallax-img"
            style={{
              position: "absolute",
              inset: "-10%",
              background: "linear-gradient(135deg, var(--chapter-1), #0a1a30, #152535)",
            }}
          >
            {/* Abstract map illustration */}
            <svg
              viewBox="0 0 800 600"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}
            >
              <path d="M100,300 Q200,100 400,250 T700,200" fill="none" stroke="var(--accent)" strokeWidth="1" />
              <path d="M50,400 Q250,200 500,350 T750,300" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
              <circle cx="400" cy="250" r="8" fill="var(--accent)" opacity="0.6" />
              <circle cx="400" cy="250" r="30" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "2rem",
              zIndex: 2,
            }}
          >
            <span className="sans-small" style={{ color: "var(--accent)", fontSize: "0.625rem" }}>
              Fig. 1 &mdash; The copper tablet, photographed in situ
            </span>
          </div>
        </div>

        <p data-reveal className="serif-body" style={{ marginBottom: "3rem" }}>
          She assembled a team of twelve: archaeologists, linguists, a cartographer,
          and two mountaineers who knew the Andes like the lines on their palms.
          They departed on the morning of March 15th, following coordinates
          encrypted in the tablet&apos;s spiral border.
        </p>

        {/* Quote */}
        <div data-reveal className="quote-block" style={{ margin: "4rem 0" }}>
          <p>
            &ldquo;We are not the first to seek Meridian. We may be the first
            to understand what it truly is.&rdquo;
          </p>
          <span className="sans-small" style={{ display: "block", marginTop: "1rem", color: "var(--text-muted)" }}>
            &mdash; Dr. Elena Vasquez, Field Journal, 1924
          </span>
        </div>

        <div className="story-divider">
          <span className="sans-small" style={{ fontSize: "0.625rem" }}>&#9830;</span>
        </div>
      </div>
    </section>
  );
}
