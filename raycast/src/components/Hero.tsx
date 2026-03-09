"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 overflow-hidden">
      {/* Radial gradient backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-ray-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/3 w-[500px] h-[400px] bg-ray-pink/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-ray-blue/6 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-ray-green animate-pulse" />
          <span className="text-xs text-ray-muted">
            Now available on all platforms
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-white">Your shortcut</span>
          <br />
          <span className="gradient-text">to everything</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-ray-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A collection of powerful productivity tools all within an extendable
          launcher. Fast, ergonomic, and reliable.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="group relative px-8 py-3.5 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-ray-pink via-ray-purple to-ray-blue overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-ray-purple/25">
            <span className="relative z-10">Download for free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-ray-purple via-ray-blue to-ray-pink opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
          <button className="px-8 py-3.5 text-sm font-medium text-ray-text rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            Explore extensions
          </button>
        </motion.div>

        {/* Command Bar Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="glass-card p-1.5 glow-purple">
            <div className="bg-[#111118] rounded-[16px] overflow-hidden">
              {/* Search bar */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-ray-muted"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <span className="text-ray-muted text-sm">
                  Search for apps and commands...
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] text-ray-muted bg-white/5 rounded border border-white/10">
                    ⌘
                  </kbd>
                  <kbd className="px-1.5 py-0.5 text-[10px] text-ray-muted bg-white/5 rounded border border-white/10">
                    K
                  </kbd>
                </div>
              </div>

              {/* Results */}
              <div className="p-2">
                {[
                  {
                    icon: "📋",
                    title: "Clipboard History",
                    subtitle: "Search recent clips",
                    shortcut: "⌘⇧V",
                  },
                  {
                    icon: "🧮",
                    title: "Calculator",
                    subtitle: "Quick math",
                    shortcut: "⌘⇧C",
                  },
                  {
                    icon: "📝",
                    title: "Snippets",
                    subtitle: "Text expansions",
                    shortcut: "⌘⇧S",
                  },
                  {
                    icon: "🪟",
                    title: "Window Management",
                    subtitle: "Organize windows",
                    shortcut: "⌘⇧W",
                  },
                  {
                    icon: "🔗",
                    title: "Quick Links",
                    subtitle: "Open bookmarks",
                    shortcut: "⌘⇧L",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.08 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                      i === 0
                        ? "bg-white/5"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white">{item.title}</div>
                      <div className="text-xs text-ray-muted">
                        {item.subtitle}
                      </div>
                    </div>
                    <span className="text-[10px] text-ray-muted font-mono">
                      {item.shortcut}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
