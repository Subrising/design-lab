"use client";

import { motion, AnimatePresence } from "framer-motion";

interface OverlayProps {
  scrollProgress: number;
  loaded: boolean;
}

export default function Overlay({ scrollProgress, loaded }: OverlayProps) {
  const percentage = Math.round(scrollProgress * 100);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {/* Loading screen */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="absolute inset-0 bg-[#050508] flex items-center justify-center z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <div className="text-center">
              <div className="w-8 h-8 border border-white/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/30 text-xs tracking-[0.3em] uppercase">
                Entering the tube
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title — fades out as you scroll */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center h-screen"
        style={{ opacity: Math.max(0, 1 - scrollProgress * 6) }}
      >
        <h1 className="text-5xl md:text-7xl font-extralight tracking-[-0.03em] text-white/90 mb-3">
          Depth Tube
        </h1>
        <p className="text-sm tracking-[0.25em] text-white/30 uppercase">
          Scroll to traverse
        </p>
        <motion.div
          className="mt-12 w-px h-12 bg-gradient-to-b from-white/30 to-transparent"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-8">
        <div className="flex items-center gap-3">
          <div className="w-24 h-px bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-indigo-500/60"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-white/30 font-mono tabular-nums">
            {String(percentage).padStart(3, "0")}%
          </span>
        </div>
      </div>

      {/* Depth indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center gap-1">
          {Array.from({ length: 12 }).map((_, i) => {
            const segmentProgress = i / 11;
            const active = scrollProgress >= segmentProgress - 0.05;
            return (
              <div
                key={i}
                className="w-px transition-all duration-500"
                style={{
                  height: active ? "12px" : "6px",
                  backgroundColor: active
                    ? "rgba(99, 102, 241, 0.6)"
                    : "rgba(255, 255, 255, 0.08)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Corner label */}
      <div className="absolute top-8 left-8">
        <p className="text-[10px] tracking-[0.3em] text-white/20 uppercase">
          Reactive Depth Tube
        </p>
      </div>

      <div className="absolute top-8 right-8">
        <p className="text-[10px] tracking-[0.3em] text-white/20 uppercase">
          R3F + GLSL
        </p>
      </div>
    </div>
  );
}
