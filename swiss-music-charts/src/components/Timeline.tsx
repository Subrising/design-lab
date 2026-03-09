"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";

interface TimelineProps {
  currentYear: number;
  currentDecade: number;
  onNavigateToYear: (year: number) => void;
  onNavigateToDecade: (decade: number) => void;
}

const DECADES = [1970, 1980, 1990, 2000, 2010, 2020];
const START_YEAR = 1974;
const END_YEAR = 2024;

export default function Timeline({
  currentYear,
  currentDecade,
  onNavigateToYear,
  onNavigateToDecade,
}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Animate indicator position
  useEffect(() => {
    if (indicatorRef.current) {
      const progress =
        (currentYear - START_YEAR) / (END_YEAR - START_YEAR);
      gsap.to(indicatorRef.current, {
        left: `${progress * 100}%`,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, [currentYear]);

  // Animate decade transition with GSAP
  useEffect(() => {
    const decadeLabels = document.querySelectorAll(".decade-label");
    decadeLabels.forEach((label) => {
      const decade = parseInt(label.getAttribute("data-decade") || "0");
      const isActive = decade === currentDecade;
      gsap.to(label, {
        scale: isActive ? 1.2 : 1,
        opacity: isActive ? 1 : 0.5,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }, [currentDecade]);

  const getYearFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return currentYear;
      const rect = trackRef.current.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      return Math.round(START_YEAR + progress * (END_YEAR - START_YEAR));
    },
    [currentYear]
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      const year = getYearFromPosition(e.clientX);
      onNavigateToYear(year);
    },
    [getYearFromPosition, onNavigateToYear]
  );

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const year = getYearFromPosition(e.clientX);
      onNavigateToYear(year);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, getYearFromPosition, onNavigateToYear]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 px-8 pb-6">
      {/* Current year display */}
      <div className="text-center mb-3">
        <span className="text-5xl font-mono font-bold text-white/90 tracking-wider">
          {currentYear}
        </span>
      </div>

      {/* Timeline track */}
      <div className="relative mx-auto max-w-5xl">
        {/* Decade labels */}
        <div className="flex justify-between mb-2 px-1">
          {DECADES.map((decade) => (
            <button
              key={decade}
              data-decade={decade}
              className="decade-label text-sm font-mono text-white/50 hover:text-white transition-colors cursor-pointer px-2 py-1"
              onClick={() => onNavigateToDecade(decade)}
            >
              {decade}s
            </button>
          ))}
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className="relative h-2 bg-white/10 rounded-full cursor-pointer group"
          onClick={handleTrackClick}
          onMouseDown={handleMouseDown}
        >
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentYear - START_YEAR) / (END_YEAR - START_YEAR)) * 100
              }%`,
            }}
          />

          {/* Decade markers */}
          {DECADES.map((decade) => {
            const pos =
              ((decade - START_YEAR) / (END_YEAR - START_YEAR)) * 100;
            return (
              <div
                key={decade}
                className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-white/30 rounded-full"
                style={{ left: `${Math.max(0, pos)}%` }}
              />
            );
          })}

          {/* Current position indicator */}
          <div
            ref={indicatorRef}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-lg shadow-indigo-500/50 border-2 border-indigo-400 group-hover:scale-125 transition-transform"
            style={{ left: "0%" }}
          />
        </div>

        {/* Year range labels */}
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs font-mono text-white/30">{START_YEAR}</span>
          <span className="text-xs font-mono text-white/30">{END_YEAR}</span>
        </div>
      </div>

      {/* Decade navigation arrows */}
      <div className="flex justify-center gap-4 mt-3">
        <button
          onClick={() =>
            onNavigateToDecade(Math.max(1970, currentDecade - 10))
          }
          className="px-4 py-1.5 text-sm font-mono text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10"
        >
          &larr; Prev Decade
        </button>
        <button
          onClick={() =>
            onNavigateToDecade(Math.min(2020, currentDecade + 10))
          }
          className="px-4 py-1.5 text-sm font-mono text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10"
        >
          Next Decade &rarr;
        </button>
      </div>
    </div>
  );
}
