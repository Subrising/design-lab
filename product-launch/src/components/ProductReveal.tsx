"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const product = productRef.current;
    if (!section || !product) return;

    // Pinned product that rotates as you scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        pin: product,
      },
    });

    // Product rotation and scale during scroll
    tl.to(product.querySelector(".product-3d"), {
      rotateY: 180,
      rotateX: 10,
      scale: 1.15,
      duration: 1,
      ease: "none",
    })
      .to(product.querySelector(".product-3d"), {
        rotateY: 360,
        rotateX: 0,
        scale: 1,
        duration: 1,
        ease: "none",
      });

    // Text reveals
    [text1Ref, text2Ref, text3Ref].forEach((ref, i) => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        }
      );

      // Fade out
      gsap.to(ref.current, {
        opacity: 0,
        y: -40,
        scrollTrigger: {
          trigger: ref.current,
          start: "bottom 40%",
          end: "bottom 10%",
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <div ref={sectionRef} style={{ height: "400vh", position: "relative" }}>
      {/* Pinned product */}
      <div
        ref={productRef}
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          className="product-3d"
          style={{
            width: "400px",
            height: "400px",
            position: "relative",
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front face - device */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "40px",
              background: "linear-gradient(145deg, #2a2a2c 0%, #1d1d1f 50%, #0a0a0a 100%)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Screen */}
            <div
              style={{
                width: "85%",
                height: "85%",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #0a0a1a, #1a0a2e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Animated gradient on screen */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "conic-gradient(from 0deg, var(--accent), var(--accent-purple), var(--accent-orange), var(--accent))",
                  opacity: 0.3,
                  filter: "blur(40px)",
                  animation: "spin 8s linear infinite",
                }}
              />
              <span style={{ fontSize: "3rem", fontWeight: 700, zIndex: 1 }}>S</span>
            </div>
          </div>
        </div>

        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(41,151,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Scroll text sections */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <div
          ref={text1Ref}
          style={{
            position: "absolute",
            top: "25%",
            left: "8%",
            maxWidth: "400px",
          }}
        >
          <h2 className="headline-medium" style={{ marginBottom: "1rem" }}>
            Forged from a single<br />
            <span className="gradient-text">piece of titanium.</span>
          </h2>
          <p className="body-large">
            A seamless unibody design that&apos;s stronger than steel and lighter than you&apos;d ever imagine.
          </p>
        </div>

        <div
          ref={text2Ref}
          style={{
            position: "absolute",
            top: "50%",
            right: "8%",
            maxWidth: "400px",
            textAlign: "right",
          }}
        >
          <h2 className="headline-medium" style={{ marginBottom: "1rem" }}>
            A display that<br />
            <span className="gradient-text-warm">defies reality.</span>
          </h2>
          <p className="body-large">
            ProMotion XDR with 2000 nits peak brightness. Every pixel is a revelation.
          </p>
        </div>

        <div
          ref={text3Ref}
          style={{
            position: "absolute",
            top: "75%",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <h2 className="headline-medium" style={{ marginBottom: "1rem" }}>
            <span className="gradient-text">M4 Ultra.</span><br />
            Pure silicon supremacy.
          </h2>
          <p className="body-large">
            The fastest chip ever in a personal device. Period.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
