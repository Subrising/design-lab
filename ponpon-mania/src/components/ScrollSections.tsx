"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: "chapter-1",
    title: "The Dream Begins",
    subtitle: "Chapter I",
    description:
      "In a field of infinite wool, Ponpon first heard the music. A bass line so deep it made the clouds tremble.",
    color: "text-[#171717]",
    accent: "text-[#f1abbd]",
  },
  {
    id: "chapter-2",
    title: "Disco Sheep",
    subtitle: "Chapter II",
    description:
      "The turntables appeared like magic — vinyl records spinning like galaxies, each groove a universe of sound.",
    color: "text-[#171717]",
    accent: "text-[#f7c704]",
  },
  {
    id: "chapter-3",
    title: "The Dark Set",
    subtitle: "Chapter III",
    description:
      "Night fell on the meadow. The crowd — a sea of wool and horns — swayed to frequencies only dreamers could hear.",
    color: "text-[#fff5f0]",
    accent: "text-[#f1abbd]",
  },
  {
    id: "chapter-4",
    title: "Encore",
    subtitle: "Chapter IV",
    description:
      "Every great DJ knows: the last track isn't the end. It's the invitation to dream again.",
    color: "text-[#171717]",
    accent: "text-[#f7c704]",
  },
];

export default function ScrollSections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((section, i) => {
        if (!section) return;

        const title = section.querySelector(".section-title");
        const subtitle = section.querySelector(".section-subtitle");
        const desc = section.querySelector(".section-desc");
        const line = section.querySelector(".section-line");

        // Title reveal with skew
        if (title) {
          gsap.fromTo(
            title,
            {
              y: 120,
              skewY: 8,
              opacity: 0,
            },
            {
              y: 0,
              skewY: 0,
              opacity: 1,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "top 25%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Subtitle slide in
        if (subtitle) {
          gsap.fromTo(
            subtitle,
            { x: -80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Description words stagger
        if (desc) {
          gsap.fromTo(
            desc,
            { y: 40, opacity: 0, rotateX: 20 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1,
              delay: 0.4,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 65%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Decorative line expansion
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.5,
              ease: "expo.inOut",
              scrollTrigger: {
                trigger: section,
                start: "top 60%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Parallax on scroll
        gsap.to(section.querySelector(".section-content"), {
          y: -50 * (i % 2 === 0 ? 1 : -1),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ zIndex: 1 }}>
      {sections.map((section, i) => (
        <section
          key={section.id}
          ref={(el) => { sectionRefs.current[i] = el; }}
          className="min-h-screen flex items-center justify-center px-8 md:px-16"
        >
          <div className="section-content max-w-4xl w-full">
            <div className="overflow-hidden mb-4">
              <p
                className={`section-subtitle font-light tracking-[0.3em] uppercase text-sm ${section.accent}`}
              >
                {section.subtitle}
              </p>
            </div>

            <div className="overflow-hidden mb-8">
              <h2
                className={`section-title text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tight ${section.color}`}
                style={{ fontFamily: "'Libre Franklin', sans-serif" }}
              >
                {section.title}
              </h2>
            </div>

            <div
              className="section-line h-[2px] mb-8 origin-left"
              style={{
                background:
                  i % 2 === 0
                    ? "linear-gradient(90deg, #f1abbd, transparent)"
                    : "linear-gradient(90deg, #f7c704, transparent)",
              }}
            />

            <div className="overflow-hidden max-w-xl">
              <p
                className={`section-desc text-lg md:text-xl leading-relaxed ${section.color} opacity-80`}
                style={{
                  fontFamily: "'Libre Franklin', sans-serif",
                  perspective: "600px",
                }}
              >
                {section.description}
              </p>
            </div>

            {/* Vinyl record decoration */}
            {i === 1 && (
              <div className="mt-12 flex items-center gap-6">
                <div
                  className="w-24 h-24 rounded-full border-4 border-[#f7c704] flex items-center justify-center"
                  style={{
                    animation: "spin 4s linear infinite",
                  }}
                >
                  <div className="w-4 h-4 rounded-full bg-[#f7c704]" />
                </div>
                <div className="text-[#f7c704] text-sm tracking-widest uppercase">
                  Now Playing
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
