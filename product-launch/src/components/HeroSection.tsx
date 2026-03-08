"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const tagline = taglineRef.current;
    const product = productRef.current;
    if (!section || !title || !subtitle || !tagline || !product) return;

    // Entrance animation
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(tagline, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
      .from(title, { y: 60, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.4")
      .from(subtitle, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .from(product, { y: 100, opacity: 0, scale: 0.9, duration: 1.2, ease: "power3.out" }, "-=0.6");

    // Scroll parallax
    gsap.to(title, {
      y: -150,
      opacity: 0,
      scale: 0.9,
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "60% top",
        scrub: true,
      },
    });

    gsap.to(subtitle, {
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "50% top",
        scrub: true,
      },
    });

    gsap.to(tagline, {
      y: -80,
      opacity: 0,
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "40% top",
        scrub: true,
      },
    });

    // Product floats up and scales
    gsap.to(product, {
      y: -200,
      scale: 1.1,
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className="section-full" style={{ paddingTop: "6rem" }}>
      <div style={{ textAlign: "center", maxWidth: "1000px", padding: "0 2rem", zIndex: 2 }}>
        <p ref={taglineRef} style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--accent)", marginBottom: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Introducing
        </p>
        <h1 ref={titleRef} className="headline-large" style={{ marginBottom: "1.5rem" }}>
          Studio Pro
        </h1>
        <p ref={subtitleRef} className="body-large" style={{ maxWidth: "600px", margin: "0 auto 3rem" }}>
          The most powerful creative tool we&apos;ve ever made. Impossibly thin. Incredibly capable.
        </p>
      </div>

      {/* Hero product - CSS 3D rendered headphones-like shape */}
      <div ref={productRef} className="product-image" style={{ position: "relative", width: "600px", height: "400px" }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #3a3a3c, #1d1d1f 60%, #000)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
        }} />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, #2a2a2c, #111 70%)",
          boxShadow: "inset 0 4px 20px rgba(0,0,0,0.6), 0 0 60px rgba(41,151,255,0.15)",
        }} />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), var(--accent-purple))",
          boxShadow: "0 0 40px rgba(41,151,255,0.4), 0 0 80px rgba(41,151,255,0.2)",
        }} />
        {/* Reflection ring */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.08)",
        }} />
      </div>
    </section>
  );
}
