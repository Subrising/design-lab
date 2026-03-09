"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const integrations = [
  { name: "GitHub", letter: "G", color: "from-gray-400 to-gray-600" },
  { name: "Slack", letter: "S", color: "from-[#E01E5A] to-[#36C5F0]" },
  { name: "Figma", letter: "F", color: "from-[#F24E1E] to-[#A259FF]" },
  { name: "GitLab", letter: "G", color: "from-[#FC6D26] to-[#E24329]" },
  { name: "Sentry", letter: "S", color: "from-[#362D59] to-[#7B6BE6]" },
  { name: "Zendesk", letter: "Z", color: "from-[#03363D] to-[#78A300]" },
  { name: "Discord", letter: "D", color: "from-[#5865F2] to-[#7289DA]" },
  { name: "Notion", letter: "N", color: "from-gray-200 to-gray-400" },
];

export default function Integrations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      <div className="glow-line w-full mb-32" />

      <div className="max-w-[1200px] mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[13px] font-medium text-linear-blue uppercase tracking-widest mb-4">
            Integrations
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] gradient-text mb-4">
            Connects to your
            <br />
            existing tools
          </h2>
          <p className="text-linear-text-secondary text-lg max-w-lg mx-auto">
            Integrate with the tools you already use, from version control to design.
          </p>
        </motion.div>

        {/* Integration grid — floating cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {integrations.map((integration, i) => (
            <motion.div
              key={integration.name}
              className="group glass rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-white/[0.04] transition-all cursor-pointer"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}
              >
                {integration.letter}
              </motion.div>
              <span className="text-[13px] text-linear-text-secondary group-hover:text-linear-text transition-colors">
                {integration.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Connection lines — visual */}
        <motion.div
          className="relative mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="relative w-48 h-48">
            {/* Center hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br from-linear-purple to-linear-blue flex items-center justify-center shadow-[0_0_40px_rgba(124,92,252,0.3)]">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                <path
                  d="M2.4 60.7c-.4-3.5-.4-7.2 0-10.7L27.5 75.2a42.5 42.5 0 0 1-25-14.5zm7-23L48 76.6A42.6 42.6 0 0 1 9.3 37.8zm13.2-16l53 53a42.6 42.6 0 0 1-53-53zm19-8.6l55 55A42.6 42.6 0 0 0 41.6 13zm22-5.3L95 36.3A42.7 42.7 0 0 0 63.5 7.8zm19 11L83 49.3a42.4 42.4 0 0 0-.5-30.5z"
                  fill="white"
                />
              </svg>
            </div>
            {/* Pulsing rings */}
            <motion.div
              className="absolute inset-0 border border-linear-purple/20 rounded-full"
              animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 border border-linear-blue/20 rounded-full"
              animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
            <motion.div
              className="absolute inset-0 border border-linear-teal/20 rounded-full"
              animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
