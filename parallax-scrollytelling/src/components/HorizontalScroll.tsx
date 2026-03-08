"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    title: "Transform",
    subtitle: "CSS transforms create fluid motion",
    gradient: "from-indigo-600 to-blue-600",
    pattern: "circle",
  },
  {
    title: "Transition",
    subtitle: "State changes flow like water",
    gradient: "from-purple-600 to-indigo-600",
    pattern: "grid",
  },
  {
    title: "Timeline",
    subtitle: "Orchestrate complex sequences",
    gradient: "from-pink-600 to-purple-600",
    pattern: "diagonal",
  },
  {
    title: "Trigger",
    subtitle: "Scroll position drives everything",
    gradient: "from-rose-600 to-pink-600",
    pattern: "dots",
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const totalWidth = track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Animate each slide's content as it enters view
    const slideEls = track.querySelectorAll(".h-slide");
    slideEls.forEach((slide) => {
      const inner = slide.querySelector(".slide-inner");
      if (!inner) return;

      gsap.from(inner, {
        scale: 0.8,
        opacity: 0.5,
        rotateY: 15,
        scrollTrigger: {
          trigger: slide,
          containerAnimation: gsap.getById("horizontalScroll") || undefined,
          start: "left center",
          end: "center center",
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center">
        <p className="text-lg text-pink-400 uppercase tracking-widest mb-2">
          Chapter 03
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Horizontal Flow
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex items-center h-screen"
        style={{ width: `${slides.length * 100}vw` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="h-slide flex-shrink-0 w-screen h-screen flex items-center justify-center px-8"
          >
            <div
              className="slide-inner w-full max-w-lg aspect-square rounded-3xl flex flex-col items-center justify-center p-12 relative overflow-hidden"
              style={{ perspective: "800px" }}
            >
              {/* Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-20 rounded-3xl`}
              />
              <div className="absolute inset-0 border border-white/10 rounded-3xl" />

              {/* Pattern overlay */}
              {slide.pattern === "grid" && (
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
              )}
              {slide.pattern === "dots" && (
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,.3) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              )}
              {slide.pattern === "diagonal" && (
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,.1) 20px, rgba(255,255,255,.1) 21px)",
                  }}
                />
              )}
              {slide.pattern === "circle" && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  {[1, 2, 3, 4].map((r) => (
                    <div
                      key={r}
                      className="absolute rounded-full border border-white/20"
                      style={{ width: `${r * 25}%`, height: `${r * 25}%` }}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 text-center">
                <span className="text-sm text-gray-400 uppercase tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-5xl md:text-7xl font-bold mt-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                  {slide.title}
                </h3>
                <p className="mt-4 text-gray-400 text-lg">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
