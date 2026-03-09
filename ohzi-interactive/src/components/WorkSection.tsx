"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const projects = [
  {
    title: "HTC Metaverse",
    category: "WebXR Experience",
    description:
      "An immersive metaverse built to showcase HTC's latest products through interactive 3D environments.",
    tech: ["Three.js", "WebXR", "GLSL"],
    number: "01",
  },
  {
    title: "Bacteria World",
    category: "Educational Interactive",
    description:
      "A microscopic universe exploring biological entities, built with particle systems and custom shaders.",
    tech: ["WebGL", "Instancing", "Physics"],
    number: "02",
  },
  {
    title: "Product Visualizer",
    category: "3D Commerce",
    description:
      "Gamified e-commerce with real-time 3D product configuration and AR preview capabilities.",
    tech: ["GLTF", "AR", "PBR"],
    number: "03",
  },
  {
    title: "Virtual Tour",
    category: "Immersive Navigation",
    description:
      "360-degree interactive environment with smooth transitions and spatial audio integration.",
    tech: ["Panorama", "Spatial Audio", "WebGL"],
    number: "04",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="group relative border border-white/5 rounded-2xl p-8 md:p-12 hover:border-white/15 transition-all duration-700 bg-white/[0.02] backdrop-blur-sm"
      data-cursor="pointer"
    >
      <div className="absolute top-8 right-8 text-white/10 text-6xl font-extralight">
        {project.number}
      </div>

      <p className="text-blue-400/60 text-xs tracking-[0.3em] uppercase mb-4">
        {project.category}
      </p>

      <h3 className="text-2xl md:text-4xl font-light text-white/90 mb-4 tracking-wider group-hover:text-white transition-colors">
        {project.title}
      </h3>

      <p className="text-white/30 text-sm leading-relaxed max-w-md mb-8">
        {project.description}
      </p>

      <div className="flex gap-3 flex-wrap">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-[10px] tracking-[0.2em] uppercase text-white/25 border border-white/10 px-3 py-1 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}

export default function WorkSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="work" className="relative z-10 px-8 py-32 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <p className="text-white/20 text-xs tracking-[0.5em] uppercase mb-4">
          Selected Projects
        </p>
        <h2 className="text-4xl md:text-6xl font-extralight text-white tracking-wider">
          Our Work
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
