"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const product = productRef.current;
    const text = textRef.current;
    if (!section || !product || !text) return;

    // Mouse tracking for 3D rotation
    const onMove = (e: MouseEvent) => {
      const rect = product.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / window.innerWidth) * 30;
      const rotateX = ((e.clientY - centerY) / window.innerHeight) * -15;

      gsap.to(product.querySelector(".product-3d"), {
        rotateY,
        rotateX,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMove);

    // Scroll entrance
    gsap.from(product, {
      opacity: 0,
      scale: 0.8,
      y: 100,
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "top 30%",
        scrub: true,
      },
    });

    gsap.from(text.querySelectorAll("[data-anim]"), {
      opacity: 0,
      x: -40,
      stagger: 0.1,
      scrollTrigger: { trigger: text, start: "top 75%", once: true },
      duration: 0.8,
      ease: "power3.out",
    });

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        padding: "4rem",
        gap: "4rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Product 3D */}
      <div ref={productRef} className="product-3d-container">
        <div className="product-3d">
          {/* Laptop body */}
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              left: "5%",
              right: "5%",
              height: "35%",
              background: "linear-gradient(180deg, #1a1a1a, #0a0a0a)",
              borderRadius: "4px 4px 12px 12px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
              transform: "perspective(800px) rotateX(70deg)",
              transformOrigin: "bottom center",
            }}
          >
            {/* Keyboard dots */}
            <div style={{ padding: "15% 10%", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "3px" }}>
              {[...Array(48)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "2px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.02)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Screen */}
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "10%",
              right: "10%",
              height: "55%",
              background: "#000",
              borderRadius: "8px 8px 0 0",
              border: "2px solid #1a1a1a",
              overflow: "hidden",
              boxShadow: "0 0 40px rgba(255,0,64,0.1)",
            }}
          >
            {/* Screen content - animated gradient */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #0a001a, #1a0020, #000a1a)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "conic-gradient(from 0deg, var(--neon-red), var(--neon-purple), var(--neon-cyan), var(--neon-red))",
                  opacity: 0.15,
                  filter: "blur(30px)",
                  animation: "rgbRotate 6s linear infinite",
                }}
              />
              {/* ROG-style logo */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "var(--neon-red)",
                  textShadow: "0 0 20px var(--neon-red)",
                  letterSpacing: "0.2em",
                }}
              >
                VX
              </div>
            </div>
          </div>

          {/* RGB strip on bottom */}
          <div
            style={{
              position: "absolute",
              bottom: "14%",
              left: "8%",
              right: "8%",
              height: "3px",
              background: "linear-gradient(90deg, var(--neon-red), var(--neon-cyan), var(--neon-green), var(--neon-purple), var(--neon-red))",
              backgroundSize: "200% 100%",
              animation: "rgbSlide 2s linear infinite",
              borderRadius: "2px",
              boxShadow: "0 0 15px rgba(255,0,64,0.5)",
            }}
          />
        </div>
      </div>

      {/* Text content */}
      <div ref={textRef}>
        <span data-anim className="mono-text" style={{ color: "var(--neon-red)" }}>
          // ENGINEERED FOR DOMINATION
        </span>

        <h2 data-anim className="display-large" style={{ margin: "1.5rem 0", lineHeight: 1.1 }}>
          <span style={{ color: "var(--neon-red)" }}>POWER</span><br />
          BEYOND<br />
          LIMITS
        </h2>

        <p data-anim style={{ color: "var(--text-dim)", lineHeight: 1.8, maxWidth: "400px", marginBottom: "2rem" }}>
          Forged from aerospace-grade aluminum with a vapor chamber cooling system
          that defies thermal physics. The Vortex X1 doesn&apos;t just run games —
          it annihilates them.
        </p>

        <div data-anim style={{ display: "flex", gap: "2rem" }}>
          <div>
            <div className="cyber-counter neon-glow-red">240</div>
            <span className="mono-text">Hz REFRESH</span>
          </div>
          <div>
            <div className="cyber-counter neon-glow-cyan">1ms</div>
            <span className="mono-text">RESPONSE</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rgbSlide {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
