"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParallaxImage from "./ParallaxImage";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Officestudio",
    category: "Design & Development",
    year: "2024",
    color: "#8C8C73",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
  },
  {
    title: "Locomotive",
    category: "Design & Development",
    year: "2023",
    color: "#706D63",
    image: "https://images.unsplash.com/photo-1634017839464-5c339afa2d09?w=800&h=600&fit=crop",
  },
  {
    title: "Silencio",
    category: "Creative Direction",
    year: "2023",
    color: "#5B5B5B",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=600&fit=crop",
  },
  {
    title: "Intrvl",
    category: "Design & Development",
    year: "2022",
    color: "#88A28D",
    image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&h=600&fit=crop",
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative px-8 py-32">
      <div className="mx-auto max-w-7xl">
        <h2
          ref={headingRef}
          className="mb-24 text-[clamp(2rem,5vw,4rem)] font-light tracking-tight"
        >
          Selected Work
        </h2>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group cursor-none ${index % 2 === 1 ? "md:mt-32" : ""}`}
      data-magnetic
      data-cursor-label="View"
    >
      <ParallaxImage
        src={project.image}
        alt={project.title}
        speed={0.2 + index * 0.1}
        className="aspect-[4/3] w-full rounded-lg"
      />

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-medium transition-transform duration-500 group-hover:translate-x-2">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {project.category}
          </p>
        </div>
        <span className="text-sm text-[var(--color-text-muted)]">
          {project.year}
        </span>
      </div>
    </div>
  );
}
