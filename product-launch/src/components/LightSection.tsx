"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LightSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    if (!section || !content || !image) return;

    // Background transition from dark to light
    gsap.to(section, {
      backgroundColor: "#f5f5f7",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      },
    });

    gsap.from(content, {
      opacity: 0,
      y: 80,
      scrollTrigger: {
        trigger: content,
        start: "top 75%",
        end: "top 45%",
        scrub: true,
      },
    });

    gsap.from(image, {
      opacity: 0,
      scale: 0.9,
      y: 60,
      scrollTrigger: {
        trigger: image,
        start: "top 80%",
        end: "top 40%",
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="light-section"
      style={{
        padding: "10rem 2rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      <div ref={contentRef} style={{ textAlign: "center", maxWidth: "700px", marginBottom: "4rem" }}>
        <p
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#30d158",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
          }}
        >
          Environment
        </p>
        <h2 className="headline-medium" style={{ color: "#1d1d1f", marginBottom: "1.5rem" }}>
          Designed with the planet in mind.
        </h2>
        <p className="body-large" style={{ color: "#6e6e73" }}>
          100% recycled aluminum enclosure. 100% recycled rare earth elements in all magnets.
          Carbon neutral shipping. Because innovation should never cost the earth.
        </p>
      </div>

      <div ref={imageRef} style={{ position: "relative", maxWidth: "800px", width: "100%" }}>
        {/* Abstract eco visual */}
        <div
          style={{
            width: "100%",
            height: "400px",
            borderRadius: "32px",
            background: "linear-gradient(135deg, #e8f5e9, #c8e6c9, #a5d6a7, #81c784)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Floating leaves/circles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: `${30 + Math.random() * 60}px`,
                height: `${30 + Math.random() * 60}px`,
                borderRadius: i % 3 === 0 ? "50%" : "30% 70% 70% 30% / 30% 30% 70% 70%",
                background: `rgba(46, 125, 50, ${0.1 + Math.random() * 0.15})`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                backdropFilter: "blur(2px)",
              }}
            />
          ))}

          {/* Center recycling icon */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="1.5">
              <path d="M7 19.5L3.5 15l3.5-4.5M17 4.5L20.5 9 17 13.5M14 4.5l-4 15" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
