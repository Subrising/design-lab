"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    import("./scene").then(({ initScene }) => {
      if (cancelled || !containerRef.current) return;
      sceneCleanup.current = initScene(containerRef.current);
    });

    return () => {
      cancelled = true;
      sceneCleanup.current?.();
    };
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f]">
      {/* WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Overlay hint — fades out */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.6 }}
      >
        <motion.p
          className="text-white/30 text-xs tracking-wider font-light"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          TYPE TO SEND A MESSAGE &middot; SCROLL TO NAVIGATE
        </motion.p>
      </motion.div>
    </main>
  );
}
