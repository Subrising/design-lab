"use client";
import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-700 ${
        visible ? "opacity-60" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
          <div className="w-full h-4 bg-white/80 absolute animate-pulse" style={{ animation: "scrollDown 2s ease-in-out infinite" }} />
        </div>
      </div>
      <style jsx>{`
        @keyframes scrollDown {
          0% { top: -16px; opacity: 0; }
          30% { opacity: 1; }
          100% { top: 48px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
