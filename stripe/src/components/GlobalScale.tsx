"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const stats = [
  { value: "135+", label: "Currencies supported" },
  { value: "99.999%", label: "Uptime SLA" },
  { value: "50+", label: "Countries" },
  { value: "500M+", label: "API requests/day" },
];

const logos = [
  "Amazon", "Google", "Shopify", "Zoom", "Slack",
  "Notion", "Figma", "Spotify", "Lyft", "DoorDash",
];

export default function GlobalScale() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const globeRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Animated globe / network visualization */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20">
        <motion.svg viewBox="0 0 200 200" className="w-full h-full" style={{ rotate: globeRotate }}>
          {/* Concentric circles */}
          {[30, 50, 70, 90].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#635bff" strokeWidth="0.3" />
          ))}
          {/* Network nodes */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const r = 30 + (i % 4) * 20;
            const cx = 100 + Math.cos(angle) * r;
            const cy = 100 + Math.sin(angle) * r;
            return <circle key={i} cx={cx} cy={cy} r="1.5" fill="#00d4ff" opacity="0.6" />;
          })}
          {/* Connection lines */}
          {Array.from({ length: 15 }).map((_, i) => {
            const a1 = (i / 15) * Math.PI * 2;
            const a2 = ((i + 3) / 15) * Math.PI * 2;
            const r1 = 30 + (i % 3) * 20;
            const r2 = 50 + ((i + 1) % 3) * 20;
            return (
              <line
                key={`l-${i}`}
                x1={100 + Math.cos(a1) * r1}
                y1={100 + Math.sin(a1) * r1}
                x2={100 + Math.cos(a2) * r2}
                y2={100 + Math.sin(a2) * r2}
                stroke="#635bff"
                strokeWidth="0.2"
                opacity="0.4"
              />
            );
          })}
        </motion.svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-16"
        >
          <p className="text-stripe-green font-semibold mb-4 text-lg">Global scale</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            The backbone of <span className="gradient-text">internet commerce</span>
          </h2>
          <p className="text-xl text-white/50 leading-relaxed">
            Trusted by millions of businesses worldwide—from startups to Fortune 500s.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="glass-card p-6"
            >
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Logo parade */}
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 items-center"
          >
            {[...logos, ...logos].map((logo, i) => (
              <span key={`${logo}-${i}`} className="text-2xl font-bold text-white/15 whitespace-nowrap">
                {logo}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
