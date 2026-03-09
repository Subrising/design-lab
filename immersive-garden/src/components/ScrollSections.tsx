"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: "hero",
    title: "Immersive",
    subtitle: "Garden",
    description: "A journey through digital landscapes",
    align: "center" as const,
  },
  {
    id: "vision",
    title: "Beyond",
    subtitle: "Boundaries",
    description:
      "We craft experiences that blur the line between the physical and digital worlds. Every pixel tells a story.",
    align: "left" as const,
  },
  {
    id: "craft",
    title: "Digital",
    subtitle: "Craftsmanship",
    description:
      "Where engineering meets artistry. WebGL shaders, procedural animations, and responsive interactions woven into seamless narratives.",
    align: "right" as const,
  },
  {
    id: "worlds",
    title: "New",
    subtitle: "Worlds",
    description:
      "Explore uncharted territories of web creativity. Real-time 3D environments that respond to your every movement.",
    align: "left" as const,
  },
  {
    id: "future",
    title: "The",
    subtitle: "Future",
    description:
      "Step into tomorrow. Interactive storytelling, cinematic web design, and boundary-pushing technology.",
    align: "center" as const,
  },
];

interface ScrollSectionsProps {
  scrollProgress: React.MutableRefObject<number>;
}

export default function ScrollSections({ scrollProgress }: ScrollSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Master scroll progress tracker
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });

    // Per-section reveal animations
    sectionRefs.current.forEach((section) => {
      if (!section) return;

      const title = section.querySelector(".section-title");
      const subtitle = section.querySelector(".section-subtitle");
      const desc = section.querySelector(".section-description");
      const line = section.querySelector(".section-line");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      });

      if (line) {
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.3 });
      }
      if (title) {
        tl.fromTo(
          title,
          { y: 80, opacity: 0, rotateX: -15 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.4 },
          0.1
        );
      }
      if (subtitle) {
        tl.fromTo(
          subtitle,
          { y: 100, opacity: 0, rotateX: -15 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.4 },
          0.2
        );
      }
      if (desc) {
        tl.fromTo(
          desc,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          0.3
        );
      }

      // Parallax exit
      gsap.to(section, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [scrollProgress]);

  const getAlignment = (align: string) => {
    switch (align) {
      case "left":
        return "items-start text-left pl-[8vw]";
      case "right":
        return "items-end text-right pr-[8vw]";
      default:
        return "items-center text-center";
    }
  };

  return (
    <div ref={containerRef} className="relative z-10">
      {sections.map((section, i) => (
        <div
          key={section.id}
          ref={(el) => { sectionRefs.current[i] = el; }}
          className={`min-h-screen flex flex-col justify-center ${getAlignment(section.align)} px-8`}
          style={{ perspective: "1000px" }}
        >
          <div
            className="section-line h-px w-32 mb-8 origin-left"
            style={{
              background:
                "linear-gradient(90deg, rgba(136,170,255,0.8), transparent)",
            }}
          />

          <h2
            className="section-title text-[clamp(2rem,8vw,6rem)] font-extralight tracking-[0.2em] uppercase text-white/90 leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {section.title}
          </h2>

          <h3
            className="section-subtitle text-[clamp(3rem,12vw,10rem)] font-bold tracking-tight text-white leading-[0.9] mt-2"
            style={{
              fontFamily: "var(--font-display)",
              textShadow: "0 0 60px rgba(100,150,255,0.3)",
            }}
          >
            {section.subtitle}
          </h3>

          <p className="section-description max-w-md text-white/50 text-lg mt-8 leading-relaxed font-light">
            {section.description}
          </p>

          {i === 0 && (
            <div className="mt-16 flex flex-col items-center gap-2 animate-pulse">
              <span className="text-white/30 text-xs tracking-[0.3em] uppercase">
                Scroll to explore
              </span>
              <svg
                className="w-4 h-8 text-white/30"
                fill="none"
                viewBox="0 0 16 32"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M8 0v28m-6-6l6 6 6-6" />
              </svg>
            </div>
          )}
        </div>
      ))}

      {/* Final spacer for scroll room */}
      <div className="h-[50vh]" />
    </div>
  );
}
