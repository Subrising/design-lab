"use client";

import { useState, useCallback, useRef } from "react";

export interface TimelineState {
  currentYear: number;
  currentDecade: number;
  isTransitioning: boolean;
  transitionProgress: number;
}

export function useTimeline() {
  const [currentYear, setCurrentYear] = useState(1974);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef(0);

  const currentDecade = Math.floor(currentYear / 10) * 10;

  const navigateToYear = useCallback((year: number) => {
    const clamped = Math.max(1974, Math.min(2024, year));
    setCurrentYear(clamped);
  }, []);

  const navigateToDecade = useCallback((decade: number) => {
    setIsTransitioning(true);
    setCurrentYear(decade);
    // Transition will be handled by GSAP in the Timeline component
    setTimeout(() => setIsTransitioning(false), 1200);
  }, []);

  const nextDecade = useCallback(() => {
    const next = Math.min(2020, currentDecade + 10);
    navigateToDecade(next);
  }, [currentDecade, navigateToDecade]);

  const prevDecade = useCallback(() => {
    const prev = Math.max(1970, currentDecade - 10);
    navigateToDecade(prev);
  }, [currentDecade, navigateToDecade]);

  return {
    currentYear,
    currentDecade,
    isTransitioning,
    transitionProgress: transitionRef.current,
    navigateToYear,
    navigateToDecade,
    nextDecade,
    prevDecade,
  };
}
