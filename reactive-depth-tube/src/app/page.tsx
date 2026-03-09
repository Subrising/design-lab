"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback } from "react";
import Overlay from "@/components/Overlay";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef(0);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      scrollRef.current = window.scrollY / maxScroll;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    const tick = () => {
      setScrollProgress((prev) => {
        const diff = scrollRef.current - prev;
        return Math.abs(diff) < 0.0001 ? prev : prev + diff * 0.08;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const timer = setTimeout(() => setLoaded(true), 600);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
    };
  }, [handleScroll]);

  return (
    <main className="relative bg-[#050508]">
      {/* Scroll spacer */}
      <div className="h-[800vh]" />

      {/* Fixed 3D canvas */}
      <div
        className="fixed inset-0 z-0"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 1.5s ease-out",
        }}
      >
        <Scene scrollProgress={scrollProgress} />
      </div>

      {/* UI Overlay */}
      <Overlay scrollProgress={scrollProgress} loaded={loaded} />
    </main>
  );
}
