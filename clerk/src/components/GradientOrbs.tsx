"use client";

import { motion } from "framer-motion";

export default function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary purple orb */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(108,71,255,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Cyan orb */}
      <motion.div
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 30, -50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(23,204,252,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Pink/magenta orb */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 40, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[30%] w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,71,167,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Small accent orb */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] left-[60%] w-[250px] h-[250px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(108,71,255,0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </div>
  );
}
