"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Chapter2() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Text reveals
    section.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    });

    // Horizontal scroll panels
    const panels = track.querySelectorAll(".h-scroll-panel");
    const totalWidth = (panels.length - 1) * window.innerWidth;

    gsap.to(track, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section.querySelector(".h-scroll-section"),
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, []);

  return (
    <section id="chapter-2" ref={sectionRef}>
      {/* Chapter intro */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "6rem 2rem" }}>
        <div data-reveal>
          <div className="chapter-marker sans-small">
            <span>Chapter Two</span>
          </div>
          <h2 className="serif-medium" style={{ marginTop: "1.5rem" }}>
            The Descent
          </h2>
        </div>

        <p data-reveal className="serif-body" style={{ marginTop: "2rem" }}>
          The jungle swallowed them whole. After two weeks of hacking through
          vegetation that seemed to regrow behind them, they found the entrance &mdash;
          a stone archway carved with the same spiral motifs as the tablet.
        </p>
      </div>

      {/* Horizontal scroll - the descent scenes */}
      <div className="h-scroll-section">
        <div ref={trackRef} className="h-scroll-track">
          {/* Panel 1 - The Archway */}
          <div className="h-scroll-panel" style={{ background: "var(--chapter-2)" }}>
            <div style={{ maxWidth: "500px", textAlign: "center", padding: "2rem" }}>
              {/* Abstract arch illustration */}
              <div
                style={{
                  width: "200px",
                  height: "300px",
                  margin: "0 auto 3rem",
                  borderRadius: "100px 100px 0 0",
                  border: "2px solid rgba(200,149,108,0.2)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "2px",
                    height: "60%",
                    background: "linear-gradient(180deg, transparent, var(--accent))",
                  }}
                />
              </div>
              <h3 className="serif-medium" style={{ fontSize: "1.8rem" }}>The Stone Archway</h3>
              <p className="serif-body" style={{ marginTop: "1rem" }}>
                Thirty meters tall, untouched by time. The spiral carvings
                pulsed with a faint bioluminescence.
              </p>
            </div>
          </div>

          {/* Panel 2 - The Tunnel */}
          <div className="h-scroll-panel" style={{ background: "linear-gradient(135deg, #0a0a10, #151020)" }}>
            <div style={{ maxWidth: "500px", textAlign: "center", padding: "2rem" }}>
              <div
                style={{
                  width: "300px",
                  height: "200px",
                  margin: "0 auto 3rem",
                  background: "radial-gradient(ellipse at center, rgba(200,149,108,0.1), transparent 70%)",
                  borderRadius: "50%",
                  position: "relative",
                }}
              >
                {/* Concentric tunnel rings */}
                {[1, 2, 3, 4, 5].map((r) => (
                  <div
                    key={r}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: `${r * 50}px`,
                      height: `${r * 35}px`,
                      borderRadius: "50%",
                      border: `1px solid rgba(200,149,108,${0.3 - r * 0.04})`,
                    }}
                  />
                ))}
              </div>
              <h3 className="serif-medium" style={{ fontSize: "1.8rem" }}>The Descent</h3>
              <p className="serif-body" style={{ marginTop: "1rem" }}>
                Five hundred steps carved into living rock, spiraling
                into the earth. The air grew warm.
              </p>
            </div>
          </div>

          {/* Panel 3 - The Chamber */}
          <div className="h-scroll-panel" style={{ background: "linear-gradient(180deg, #100a18, #1a1028)" }}>
            <div style={{ maxWidth: "500px", textAlign: "center", padding: "2rem" }}>
              <div
                style={{
                  width: "250px",
                  height: "250px",
                  margin: "0 auto 3rem",
                  position: "relative",
                }}
              >
                {/* Abstract geometric chamber */}
                <div style={{
                  position: "absolute",
                  inset: "20%",
                  border: "1px solid rgba(200,149,108,0.15)",
                  transform: "rotate(45deg)",
                }} />
                <div style={{
                  position: "absolute",
                  inset: "30%",
                  border: "1px solid rgba(200,149,108,0.25)",
                  transform: "rotate(22.5deg)",
                }} />
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 30px rgba(200,149,108,0.5)",
                }} />
              </div>
              <h3 className="serif-medium" style={{ fontSize: "1.8rem" }}>The Grand Chamber</h3>
              <p className="serif-body" style={{ marginTop: "1rem" }}>
                A cathedral of crystal and stone, untouched for millennia.
                At its center, a device that defied all understanding.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "6rem 2rem" }}>
        <div className="story-divider">
          <span className="sans-small" style={{ fontSize: "0.625rem" }}>&#9830;</span>
        </div>
      </div>
    </section>
  );
}
