"use client";

import { useRef, useCallback, useEffect } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.4,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const bounds = useRef<DOMRect | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!btnRef.current || !bounds.current) return;

      const cx = bounds.current.left + bounds.current.width / 2;
      const cy = bounds.current.top + bounds.current.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Move button toward cursor
      btnRef.current.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;

      // Move inner text slightly more for parallax
      if (textRef.current) {
        textRef.current.style.transform = `translate(${dx * strength * 0.6}px, ${dy * strength * 0.6}px)`;
      }
    },
    [strength]
  );

  const handleMouseEnter = useCallback(() => {
    if (btnRef.current) {
      bounds.current = btnRef.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (btnRef.current) {
      btnRef.current.style.transform = "";
      btnRef.current.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
      setTimeout(() => {
        if (btnRef.current) btnRef.current.style.transition = "";
      }, 500);
    }
    if (textRef.current) {
      textRef.current.style.transform = "";
      textRef.current.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
      setTimeout(() => {
        if (textRef.current) textRef.current.style.transition = "";
      }, 500);
    }
  }, []);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    btn.addEventListener("mouseenter", handleMouseEnter);
    btn.addEventListener("mousemove", handleMouseMove as EventListener);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mouseenter", handleMouseEnter);
      btn.removeEventListener("mousemove", handleMouseMove as EventListener);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseEnter, handleMouseMove, handleMouseLeave]);

  return (
    <button
      ref={btnRef}
      className={`magnetic-btn ${className}`}
      data-magnetic
    >
      <span ref={textRef}>{children}</span>
    </button>
  );
}
