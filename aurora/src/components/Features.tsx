"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Keyboard-first",
    description: "Every action has a shortcut. Navigate, create, and manage without touching your mouse.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 10h1M9 10h1M12 10h1M15 10h1M18 10h1" />
        <path d="M8 14h8" />
      </svg>
    ),
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Blazing fast",
    description: "Built with performance obsession. Sub-50ms interactions, optimistic updates, real-time sync.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    title: "Beautiful by default",
    description: "Opinionated design with dark mode, smooth animations, and thoughtful micro-interactions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Workflow automation",
    description: "Automate repetitive tasks with custom rules, triggers, and integrations with your stack.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
        <path d="M17 14v3h-3M17 17l-4 4" />
      </svg>
    ),
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Real-time collaboration",
    description: "See who's viewing, editing, and commenting. Presence indicators and live cursors built in.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    gradient: "from-accent/20 to-violet-500/20",
  },
  {
    title: "Git-native",
    description: "Branch-based workflows, PR links, commit references. Your code and issues, connected.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M12 15V9M6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" />
      </svg>
    ),
    gradient: "from-rose-500/20 to-red-500/20",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl glass glass-hover p-6 transition-all duration-300"
    >
      {/* Gradient glow on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center text-accent-light mb-4 group-hover:border-accent/30 transition-colors">
          {feature.icon}
        </div>
        <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="features" ref={ref} className="relative py-32">
      {/* Parallax background element */}
      <motion.div
        style={{ y: bgY }}
        className="absolute right-0 top-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-accent-light mb-3 font-medium">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient mb-4">
            Everything you need to ship
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Purpose-built for modern engineering teams. Fast, beautiful, and deeply integrated.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
