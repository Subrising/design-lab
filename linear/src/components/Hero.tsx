"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="gradient-mesh" />
      <div className="gradient-mesh-extra" />
      <div className="grid-pattern absolute inset-0" />

      {/* Animated orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full border border-white/[0.03]"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full border border-white/[0.02]"
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[1000px] h-[1000px] rounded-full border border-white/[0.015]"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
        {/* Orbiting dots */}
        <motion.div
          className="absolute w-[600px] h-[600px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-linear-purple rounded-full shadow-[0_0_10px_rgba(124,92,252,0.5)]" />
        </motion.div>
        <motion.div
          className="absolute w-[800px] h-[800px]"
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-linear-blue rounded-full shadow-[0_0_10px_rgba(91,141,239,0.5)]" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8"
            whileHover={{ scale: 1.02 }}
          >
            <span className="w-1.5 h-1.5 bg-linear-teal rounded-full animate-pulse" />
            <span className="text-[13px] text-linear-text-secondary">
              Introducing Linear Insights
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-linear-text-secondary">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold tracking-[-0.04em] leading-[0.95] gradient-text mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Linear is a better way
          <br />
          to build products
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-linear-text-secondary max-w-xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Meet the new standard for modern software development.
          Streamline issues, sprints, and product roadmaps.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            className="relative group px-8 py-3 rounded-xl text-[15px] font-medium text-white overflow-hidden"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-linear-purple via-linear-blue to-linear-teal" />
            <div className="absolute inset-0 bg-gradient-to-r from-linear-purple via-linear-blue to-linear-teal opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
            <span className="relative">Get started</span>
          </motion.button>
          <motion.button
            className="glass px-8 py-3 rounded-xl text-[15px] font-medium text-linear-text-secondary hover:text-linear-text transition-colors"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Watch demo →
          </motion.button>
        </motion.div>

        {/* Hero visual — app preview */}
        <motion.div
          className="relative mt-20 mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          <div className="glass-strong rounded-xl overflow-hidden glow-purple">
            <div className="p-3 border-b border-white/[0.06] flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="glass rounded-md px-4 py-1 text-[11px] text-linear-text-secondary">
                  linear.app
                </div>
              </div>
            </div>
            {/* Fake app content */}
            <div className="p-6 space-y-3">
              {/* Sidebar + content layout */}
              <div className="flex gap-4">
                <div className="w-48 space-y-2 shrink-0">
                  {["My Issues", "Active", "Backlog", "Projects", "Views", "Teams"].map((item, i) => (
                    <motion.div
                      key={item}
                      className={`px-3 py-1.5 rounded-md text-[12px] ${i === 0 ? "bg-white/[0.06] text-white" : "text-linear-text-secondary"}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + i * 0.05 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
                <div className="flex-1 space-y-2">
                  {[
                    { id: "LIN-142", title: "Add keyboard shortcuts to editor", status: "In Progress", priority: "Urgent" },
                    { id: "LIN-139", title: "Redesign settings page", status: "In Review", priority: "High" },
                    { id: "LIN-136", title: "Fix notification delays", status: "Todo", priority: "Medium" },
                    { id: "LIN-133", title: "API rate limiting improvements", status: "In Progress", priority: "High" },
                    { id: "LIN-130", title: "Dark mode contrast fixes", status: "Done", priority: "Low" },
                  ].map((issue, i) => (
                    <motion.div
                      key={issue.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/[0.03] transition-colors"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + i * 0.08 }}
                    >
                      <div className={`w-3 h-3 rounded-sm ${
                        issue.priority === "Urgent" ? "bg-red-500" :
                        issue.priority === "High" ? "bg-orange-400" :
                        issue.priority === "Medium" ? "bg-yellow-400" :
                        "bg-green-400"
                      }`} />
                      <span className="text-[11px] text-linear-text-secondary font-mono w-16">{issue.id}</span>
                      <span className="text-[12px] text-linear-text flex-1">{issue.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        issue.status === "Done" ? "bg-green-500/10 text-green-400" :
                        issue.status === "In Progress" ? "bg-yellow-500/10 text-yellow-400" :
                        issue.status === "In Review" ? "bg-blue-500/10 text-blue-400" :
                        "bg-white/[0.05] text-linear-text-secondary"
                      }`}>{issue.status}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Reflection glow */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-gradient-to-t from-transparent to-linear-purple/10 blur-3xl" />
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-linear-bg to-transparent" />
    </section>
  );
}
