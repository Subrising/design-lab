"use client";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  scale: number;
  text: string;
}

export function useMagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const state = useRef<CursorState>({ x: 0, y: 0, isHovering: false, scale: 1, text: "" });

  const moveCursor = useCallback((e: MouseEvent) => {
    state.current.x = e.clientX;
    state.current.y = e.clientY;

    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      });
    }

    if (cursorTextRef.current) {
      gsap.to(cursorTextRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.7,
        ease: "power3.out",
      });
    }
  }, []);

  const handleMagneticEnter = useCallback((e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const label = target.dataset.cursorLabel || "";
    state.current.isHovering = true;
    state.current.text = label;

    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: label ? 4 : 2,
        duration: 0.4,
        ease: "power3.out",
      });
    }

    if (cursorTextRef.current) {
      cursorTextRef.current.textContent = label;
      gsap.to(cursorTextRef.current, {
        opacity: label ? 1 : 0,
        scale: 1,
        duration: 0.3,
      });
    }
  }, []);

  const handleMagneticMove = useCallback((e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.35;
    const deltaY = (e.clientY - centerY) * 0.35;

    gsap.to(target, {
      x: deltaX,
      y: deltaY,
      duration: 0.5,
      ease: "power3.out",
    });
  }, []);

  const handleMagneticLeave = useCallback((e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    state.current.isHovering = false;
    state.current.text = "";

    gsap.to(target, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.3)",
    });

    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    }

    if (cursorTextRef.current) {
      gsap.to(cursorTextRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.3,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", moveCursor);

    const magneticElements = document.querySelectorAll("[data-magnetic]");
    magneticElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMagneticEnter as EventListener);
      el.addEventListener("mousemove", handleMagneticMove as EventListener);
      el.addEventListener("mouseleave", handleMagneticLeave as EventListener);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      magneticElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMagneticEnter as EventListener);
        el.removeEventListener("mousemove", handleMagneticMove as EventListener);
        el.removeEventListener("mouseleave", handleMagneticLeave as EventListener);
      });
    };
  }, [moveCursor, handleMagneticEnter, handleMagneticMove, handleMagneticLeave]);

  return { cursorRef, cursorTextRef };
}
