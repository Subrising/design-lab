"use client";

import { useState, useCallback } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  }, []);

  return (
    <span
      className={`relative inline-block cursor-pointer ${className}`}
      onMouseEnter={triggerGlitch}
    >
      {/* Base layer */}
      <span className="relative z-10">{text}</span>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 text-red-500/70 z-20"
            style={{
              clipPath: "polygon(0 10%, 100% 10%, 100% 30%, 0 30%)",
              transform: "translate(-3px, -1px)",
              animation: "glitch1 0.3s steps(2) infinite",
            }}
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-cyan-400/70 z-20"
            style={{
              clipPath: "polygon(0 60%, 100% 60%, 100% 80%, 0 80%)",
              transform: "translate(3px, 1px)",
              animation: "glitch2 0.3s steps(3) infinite",
            }}
          >
            {text}
          </span>
        </>
      )}

      <style jsx>{`
        @keyframes glitch1 {
          0% { transform: translate(-3px, -1px); }
          25% { transform: translate(2px, 1px); }
          50% { transform: translate(-1px, 2px); }
          75% { transform: translate(3px, -2px); }
          100% { transform: translate(-2px, 1px); }
        }
        @keyframes glitch2 {
          0% { transform: translate(3px, 1px); }
          33% { transform: translate(-2px, -1px); }
          66% { transform: translate(1px, -2px); }
          100% { transform: translate(-3px, 2px); }
        }
      `}</style>
    </span>
  );
}
