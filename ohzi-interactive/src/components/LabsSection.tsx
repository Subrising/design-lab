"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const experiments = [
  { title: "Particle Galaxy", tag: "Shader", color: "from-blue-500/20 to-purple-500/20" },
  { title: "Fluid Dynamics", tag: "Physics", color: "from-cyan-500/20 to-blue-500/20" },
  { title: "Neural Mesh", tag: "Generative", color: "from-purple-500/20 to-pink-500/20" },
  { title: "Volumetric Light", tag: "Ray March", color: "from-yellow-500/20 to-orange-500/20" },
  { title: "Metaball Fields", tag: "SDF", color: "from-green-500/20 to-cyan-500/20" },
  { title: "Audio Reactive", tag: "WebAudio", color: "from-pink-500/20 to-red-500/20" },
];

export default function LabsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="labs" className="relative z-10 px-8 py-32 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <p className="text-white/20 text-xs tracking-[0.5em] uppercase mb-4">
          Experiments
        </p>
        <h2 className="text-4xl md:text-6xl font-extralight text-white tracking-wider">
          Labs
        </h2>
        <p className="text-white/25 text-sm mt-6 max-w-lg tracking-wider">
          From quirky shaders to wild physics — our playground for pushing the
          boundaries of what&#39;s possible on the web.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiments.map((exp, i) => {
          const cardRef = useRef(null);
          const cardInView = useInView(cardRef, {
            once: true,
            margin: "-50px",
          });

          return (
            <motion.div
              key={exp.title}
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={cardInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br ${exp.color} border border-white/5 hover:border-white/15 transition-all duration-500 flex flex-col justify-end p-6`}
              data-cursor="pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative z-10">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2 block">
                  {exp.tag}
                </span>
                <h3 className="text-lg font-light text-white/80 tracking-wider group-hover:text-white transition-colors">
                  {exp.title}
                </h3>
              </div>

              {/* Animated shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  delay: i * 0.5,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
