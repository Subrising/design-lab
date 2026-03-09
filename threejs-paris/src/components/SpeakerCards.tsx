"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Speaker {
  name: string;
  role: string;
  talk: string;
  color: string;
  initials: string;
}

const speakers: Speaker[] = [
  { name: "Bruno Simon", role: "Creative Developer", talk: "Building Immersive Worlds with Three.js", color: "#00d4ff", initials: "BS" },
  { name: "Lea Rosema", role: "WebGL Artist", talk: "Shader Art: From GLSL to Gallery", color: "#a855f7", initials: "LR" },
  { name: "Anderson Mancini", role: "R3F Core Team", talk: "React Three Fiber: What's Next", color: "#ec4899", initials: "AM" },
  { name: "Yuri Artiukh", role: "Creative Coder", talk: "Particle Systems at Scale", color: "#00d4ff", initials: "YA" },
  { name: "Maxime Heckel", role: "Design Engineer", talk: "Shaders for UI Engineers", color: "#a855f7", initials: "MH" },
  { name: "Cami Williams", role: "XR Developer", talk: "WebXR & Three.js: The Future", color: "#ec4899", initials: "CW" },
];

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotation({
      x: (y - 0.5) * -20,
      y: (x - 0.5) * 20,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div
        ref={cardRef}
        className="neon-border group relative cursor-pointer overflow-hidden rounded-2xl bg-[#12121a] p-6 transition-shadow duration-300"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovering ? 1.02 : 1})`,
          transition: isHovering ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
          boxShadow: isHovering
            ? `0 0 30px ${speaker.color}33, 0 20px 60px rgba(0,0,0,0.5)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow effect on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${(rotation.y / 20 + 0.5) * 100}% ${(-rotation.x / 20 + 0.5) * 100}%, ${speaker.color}15, transparent 60%)`,
          }}
        />
        {/* Avatar */}
        <div
          className="mb-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold"
          style={{
            background: `linear-gradient(135deg, ${speaker.color}40, ${speaker.color}10)`,
            border: `2px solid ${speaker.color}60`,
            color: speaker.color,
          }}
        >
          {speaker.initials}
        </div>
        <h3 className="mb-1 text-xl font-bold text-white">{speaker.name}</h3>
        <p className="mb-3 text-sm" style={{ color: speaker.color }}>{speaker.role}</p>
        <p className="text-sm leading-relaxed text-slate-400">{speaker.talk}</p>
        {/* Corner accent */}
        <div
          className="absolute right-0 top-0 h-16 w-16 opacity-20"
          style={{
            background: `linear-gradient(225deg, ${speaker.color}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function SpeakerCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="speakers" className="relative py-32 px-4" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-widest text-cyan-400 uppercase">
            Speakers
          </span>
          <h2 className="text-4xl font-black text-white md:text-6xl">
            World-Class{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Speakers
            </span>
          </h2>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker, i) => (
            <SpeakerCard key={speaker.name} speaker={speaker} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
