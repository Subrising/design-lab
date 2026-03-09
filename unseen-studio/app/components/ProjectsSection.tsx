"use client";

import SplitText from "./SplitText";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "Meridian",
    category: "Brand Identity",
    year: "2024",
    color: "#c8ff00",
    imageGradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  },
  {
    title: "Flux Studio",
    category: "Web Design",
    year: "2024",
    color: "#ff6b35",
    imageGradient: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
  },
  {
    title: "Noir Gallery",
    category: "E-Commerce",
    year: "2023",
    color: "#e0aaff",
    imageGradient: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
  },
  {
    title: "Artemis",
    category: "Digital Product",
    year: "2024",
    color: "#00f5d4",
    imageGradient: "linear-gradient(135deg, #0c0c1d 0%, #1a0a2e 50%, #2d1b69 100%)",
  },
  {
    title: "Terraform",
    category: "Interactive",
    year: "2023",
    color: "#ffd60a",
    imageGradient: "linear-gradient(135deg, #1b1b2f 0%, #162447 50%, #1f4068 100%)",
  },
  {
    title: "Obsidian",
    category: "Art Direction",
    year: "2024",
    color: "#ff006e",
    imageGradient: "linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #2d132c 100%)",
  },
];

export default function ProjectsSection() {
  return (
    <section id="work" className="px-6 md:px-12 py-32">
      {/* Section header */}
      <div className="flex items-end justify-between mb-20">
        <div>
          <span className="text-xs tracking-[0.4em] uppercase text-[#666] block mb-4">
            Selected Work
          </span>
          <SplitText
            text="Featured Projects"
            as="h2"
            className="text-[8vw] md:text-[5vw] font-light leading-[1] tracking-[-0.03em]"
            animation="words"
            scrollTrigger
            stagger={0.03}
            cursorHover
          />
        </div>
        <span className="text-sm text-[#666] hidden md:block">
          ({projects.length.toString().padStart(2, "0")})
        </span>
      </div>

      {/* Project grid — asymmetric Bento style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {projects.map((project, i) => (
          <div
            key={project.title}
            className={i % 3 === 0 ? "md:col-span-2" : ""}
          >
            <ProjectCard {...project} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
