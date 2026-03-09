"use client";
import { useMagneticCursor } from "@/hooks/useMagneticCursor";

export default function CustomCursor() {
  const { cursorRef, cursorTextRef } = useMagneticCursor();

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      >
        <div className="h-4 w-4 rounded-full bg-white transition-transform" />
      </div>
      <div
        ref={cursorTextRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0"
      >
        <span className="text-xs font-medium whitespace-nowrap text-white mix-blend-difference" />
      </div>
    </>
  );
}
