"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Talk {
  time: string;
  title: string;
  speaker: string;
  track: string;
  color: string;
}

const day1: Talk[] = [
  { time: "09:00", title: "Opening Keynote: The State of WebGL", speaker: "Bruno Simon", track: "Main Stage", color: "#00d4ff" },
  { time: "10:00", title: "Shader Art: From GLSL to Gallery", speaker: "Lea Rosema", track: "Workshop", color: "#a855f7" },
  { time: "11:30", title: "React Three Fiber: What's Next", speaker: "Anderson Mancini", track: "Main Stage", color: "#ec4899" },
  { time: "13:00", title: "Lunch Break & Networking", speaker: "", track: "Lounge", color: "#64748b" },
  { time: "14:30", title: "Particle Systems at Scale", speaker: "Yuri Artiukh", track: "Main Stage", color: "#00d4ff" },
  { time: "16:00", title: "Shaders for UI Engineers", speaker: "Maxime Heckel", track: "Workshop", color: "#a855f7" },
  { time: "17:30", title: "WebXR & Three.js: The Future", speaker: "Cami Williams", track: "Main Stage", color: "#ec4899" },
  { time: "19:00", title: "After Party & Live Coding", speaker: "", track: "Lounge", color: "#64748b" },
];

function TimelineItem({ talk, index }: { talk: Talk; index: number }) {
  return (
    <motion.div
      className="group relative flex gap-6"
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* Time */}
      <div className="w-16 shrink-0 pt-1 text-right font-mono text-sm text-slate-500">
        {talk.time}
      </div>
      {/* Timeline line + dot */}
      <div className="relative flex flex-col items-center">
        <div
          className="z-10 h-3 w-3 rounded-full"
          style={{
            backgroundColor: talk.color,
            boxShadow: `0 0 10px ${talk.color}80`,
          }}
        />
        <div className="w-px grow bg-gradient-to-b from-slate-700 to-transparent" />
      </div>
      {/* Card */}
      <div className="mb-8 flex-1 rounded-xl border border-slate-800 bg-[#12121a] p-5 transition-all duration-300 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)]">
        <div className="mb-1 flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${talk.color}20`,
              color: talk.color,
            }}
          >
            {talk.track}
          </span>
        </div>
        <h3 className="mb-1 text-lg font-bold text-white">{talk.title}</h3>
        {talk.speaker && (
          <p className="text-sm text-slate-400">{talk.speaker}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function Schedule() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="schedule" className="relative py-32 px-4" ref={ref}>
      {/* Background accent */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-3xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-widest text-purple-400 uppercase">
            Schedule
          </span>
          <h2 className="text-4xl font-black text-white md:text-6xl">
            Day{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              One
            </span>
          </h2>
          <p className="mt-4 text-slate-400">June 14, 2025 — La Gaite Lyrique</p>
        </motion.div>
        <div className="flex flex-col">
          {day1.map((talk, i) => (
            <TimelineItem key={talk.time} talk={talk} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
