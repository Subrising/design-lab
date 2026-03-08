"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
  { name: "Deconstructed Blazer", price: "$1,850", color: "#2d1b69" },
  { name: "Silk Drape Dress", price: "$2,200", color: "#1a3a5c" },
  { name: "Architectural Coat", price: "$3,400", color: "#3d2b1f" },
  { name: "Pleated Wide Trouser", price: "$980", color: "#1f3d2b" },
  { name: "Asymmetric Knit", price: "$1,100", color: "#3d1f2b" },
  { name: "Sculptural Top", price: "$750", color: "#2b3d1f" },
];

export default function CollectionScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const heading = headingRef.current;
    if (!section || !track || !heading) return;

    // Heading animation
    gsap.from(heading.querySelectorAll("[data-anim]"), {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: heading, start: "top 80%", once: true },
    });

    // Horizontal scroll
    const totalWidth = track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ overflow: "hidden" }}>
      <div ref={headingRef} style={{ padding: "6rem 4rem 3rem" }}>
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
          Key Pieces
        </span>
        <h2 data-anim className="display-lg" style={{ marginTop: "1rem" }}>
          The Edit
        </h2>
      </div>

      <div ref={trackRef} className="horizontal-track" style={{ padding: "0 4rem 6rem" }}>
        {products.map((product, i) => (
          <div key={i} className="product-card">
            <div className="product-card-image">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(165deg, ${product.color} 0%, #0a0a0a 80%)`,
                  position: "relative",
                }}
              >
                {/* Abstract product shape */}
                <div
                  style={{
                    position: "absolute",
                    top: "15%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60%",
                    height: "65%",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "2px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "12%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--accent-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>

                {/* Number */}
                <span
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    fontSize: "0.625rem",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="product-card-info">
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>{product.name}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  {product.price}
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
