"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  category: string;
  year: string;
  color: string;
  span: string;
}

const PROJECTS: Project[] = [
  {
    title: "Meridian",
    category: "Brand Identity",
    year: "2025",
    color: "#e63946",
    span: "col-span-7 row-span-2",
  },
  {
    title: "Void",
    category: "Digital Experience",
    year: "2025",
    color: "#1d3557",
    span: "col-span-5 row-span-1",
  },
  {
    title: "Prism",
    category: "Campaign",
    year: "2024",
    color: "#556b2f",
    span: "col-span-5 row-span-1",
  },
  {
    title: "Flux",
    category: "Art Direction",
    year: "2024",
    color: "#5b21b6",
    span: "col-span-4 row-span-2",
  },
  {
    title: "Aether",
    category: "Motion Design",
    year: "2024",
    color: "#c9b99a",
    span: "col-span-8 row-span-1",
  },
  {
    title: "Onyx",
    category: "Typography",
    year: "2023",
    color: "#1a1a1a",
    span: "col-span-6 row-span-1",
  },
  {
    title: "Zenith",
    category: "Interactive",
    year: "2023",
    color: "#e63946",
    span: "col-span-6 row-span-1",
  },
];

export default function ExperimentalGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const items = itemsRef.current;
    if (!items.length) return;

    items.forEach((item, i) => {
      gsap.fromTo(
        item,
        {
          y: 120,
          opacity: 0,
          scale: 0.92,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.8,
          },
        }
      );

      // Parallax on the title inside
      const title = item.querySelector(".project-title");
      if (title) {
        gsap.to(title, {
          yPercent: -30,
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="relative py-32 px-4 md:px-8" style={{ background: "var(--color-epic-black)" }}>
      {/* Section header */}
      <div className="max-w-[1800px] mx-auto mb-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] opacity-40 mb-4">
              Selected Work
            </p>
            <h2 className="display-large font-sans font-bold">
              PROJ
              <span style={{ color: "var(--color-epic-red)" }}>E</span>
              CTS
            </h2>
          </div>
          <p className="text-sm opacity-50 max-w-xs text-right hidden md:block">
            A curated selection of our most ambitious creative endeavors
          </p>
        </div>
        <div
          className="line-accent mt-8"
          style={{ opacity: 0.15 }}
        />
      </div>

      {/* Asymmetric grid */}
      <div
        ref={gridRef}
        className="max-w-[1800px] mx-auto grid grid-cols-12 gap-3 auto-rows-[280px] md:auto-rows-[360px]"
      >
        {PROJECTS.map((project, i) => (
          <div
            key={project.title}
            ref={(el) => {
              if (el) itemsRef.current[i] = el;
            }}
            className={`${project.span} relative group cursor-pointer overflow-hidden`}
          >
            {/* Background */}
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              style={{ background: project.color }}
            />

            {/* Noise overlay */}
            <div
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-[0.3em] opacity-60">
                  {project.category}
                </span>
                <span className="text-xs opacity-40">{project.year}</span>
              </div>

              <div>
                <h3
                  className="project-title font-sans font-bold text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-none"
                  style={{ color: "var(--color-epic-white)" }}
                >
                  {project.title}
                </h3>
                {/* Hover reveal line */}
                <div className="h-[1px] bg-white/40 mt-4 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>

            {/* Corner index */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 text-[8rem] md:text-[12rem] font-bold leading-none opacity-5 pointer-events-none select-none">
              {String(i + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
