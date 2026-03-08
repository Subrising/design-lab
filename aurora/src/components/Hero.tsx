"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Radial glow behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="glass rounded-full px-4 py-1.5 text-xs font-medium text-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now in public beta
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-gradient">Build software</span>
          <br />
          <span className="text-gradient-accent">at the speed of thought</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The issue tracker designed for speed. Streamline issues, projects,
          and product roadmaps with keyboard-first workflows.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="group relative px-6 py-3 rounded-xl bg-accent text-white font-medium text-sm overflow-hidden transition-all hover:shadow-lg hover:shadow-accent/20">
            <span className="relative z-10">Start building — free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl glass glass-hover text-sm font-medium text-muted hover:text-foreground transition-all">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted">
              <path d="M13 8L5 12.5V3.5L13 8Z" fill="currentColor" />
            </svg>
            Watch demo
          </button>
        </motion.div>

        {/* Floating UI mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-16 relative"
        >
          <div className="glass rounded-2xl p-1 glow-accent">
            <div className="bg-surface rounded-xl overflow-hidden">
              {/* Mock app header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted font-mono">aurora.app — Dashboard</span>
                </div>
              </div>

              {/* Mock app content */}
              <div className="p-6 grid grid-cols-12 gap-4 min-h-[300px]">
                {/* Sidebar */}
                <div className="col-span-3 space-y-3">
                  {["Inbox", "My Issues", "Projects", "Views", "Teams"].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.1 }}
                      className={`text-xs px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                        i === 1 ? "bg-accent/10 text-accent-light" : "text-muted hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>

                {/* Main content */}
                <div className="col-span-9 space-y-2">
                  {[
                    { id: "AUR-127", title: "Add keyboard shortcut panel", status: "In Progress", priority: "high" },
                    { id: "AUR-126", title: "Optimize scroll performance", status: "Todo", priority: "medium" },
                    { id: "AUR-125", title: "Design dark mode tokens", status: "Done", priority: "low" },
                    { id: "AUR-124", title: "Implement glass morphism cards", status: "In Progress", priority: "high" },
                    { id: "AUR-123", title: "Add parallax hero section", status: "Done", priority: "medium" },
                  ].map((issue, i) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + i * 0.1 }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        issue.priority === "high" ? "bg-orange-400" : issue.priority === "medium" ? "bg-yellow-400" : "bg-blue-400"
                      }`} />
                      <span className="text-xs text-muted font-mono w-16">{issue.id}</span>
                      <span className="text-xs text-foreground/80 flex-1">{issue.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        issue.status === "Done"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : issue.status === "In Progress"
                          ? "bg-accent/10 text-accent-light"
                          : "bg-zinc-500/10 text-zinc-400"
                      }`}>
                        {issue.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Decorative gradient below mockup */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-accent/10 blur-[100px] rounded-full" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-border flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
