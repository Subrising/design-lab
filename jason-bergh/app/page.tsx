"use client";

import HeroSection from "./components/HeroSection";
import ProjectSection from "./components/ProjectSection";
import FooterSection from "./components/FooterSection";
import ScrollProgress from "./components/ScrollProgress";
import SideNav from "./components/SideNav";
import CinematicBars from "./components/CinematicBars";

const projects = [
  {
    title: "Meridian",
    subtitle: "A cinematic journey through light and architecture",
    category: "Film",
    year: "2025",
    color: "#e8d5b7",
    gradient:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)",
  },
  {
    title: "Nocturne",
    subtitle: "Visual poetry of urban landscapes after dark",
    category: "Photography",
    year: "2024",
    color: "#a8c5da",
    gradient:
      "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 30%, #2d1b69 60%, #11001c 100%)",
  },
  {
    title: "Terraform",
    subtitle: "Reshaping reality through digital manipulation",
    category: "Digital Art",
    year: "2024",
    color: "#c5e8b7",
    gradient:
      "linear-gradient(135deg, #0d1117 0%, #161b22 30%, #1f4037 60%, #99f2c8 100%)",
  },
  {
    title: "Echoes",
    subtitle: "Sound and vision collide in immersive installation",
    category: "Installation",
    year: "2023",
    color: "#e8b7b7",
    gradient:
      "linear-gradient(135deg, #1a0000 0%, #2d0000 30%, #4a0e0e 60%, #7a1818 100%)",
  },
  {
    title: "Parallax",
    subtitle: "Multi-layered narratives in perpetual motion",
    category: "Motion",
    year: "2023",
    color: "#d4b7e8",
    gradient:
      "linear-gradient(135deg, #0f0c29 0%, #302b63 30%, #24243e 60%, #1a1a2e 100%)",
  },
  {
    title: "Synthesis",
    subtitle: "Where analog craftsmanship meets digital precision",
    category: "Mixed Media",
    year: "2022",
    color: "#e8dab7",
    gradient:
      "linear-gradient(135deg, #141e30 0%, #243b55 30%, #4b6584 60%, #141e30 100%)",
  },
];

const totalSections = projects.length + 2; // hero + projects + footer

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SideNav sectionCount={totalSections} />
      <CinematicBars />
      <div className="grain-overlay" />
      <div className="vignette" />

      <HeroSection />

      {projects.map((project, i) => (
        <ProjectSection
          key={project.title}
          {...project}
          index={i}
          total={projects.length}
        />
      ))}

      <FooterSection />
    </>
  );
}
