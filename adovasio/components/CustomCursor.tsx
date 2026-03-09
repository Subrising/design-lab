"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Hide on touch devices
    if ("ontouchstart" in window) {
      cursor.style.display = "none";
      follower.style.display = "none";
      return;
    }

    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.1,
        ease: "power2.out",
      });
      gsap.to(follower, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onEnterLink = () => {
      gsap.to(cursor, { scale: 0, duration: 0.2 });
      gsap.to(follower, { scale: 2, opacity: 0.3, duration: 0.3 });
    };

    const onLeaveLink = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(follower, { scale: 1, opacity: 0.15, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMove);

    const links = document.querySelectorAll("a, button, [data-cursor-hover]");
    links.forEach((link) => {
      link.addEventListener("mouseenter", onEnterLink);
      link.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", onEnterLink);
        link.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="cursor-dot hidden md:block"
        style={{ transform: "translate(-100px, -100px)" }}
      />
      <div
        ref={followerRef}
        className="hidden md:block fixed w-10 h-10 rounded-full border border-gold/40 pointer-events-none z-[9998]"
        style={{
          transform: "translate(-100px, -100px)",
          opacity: 0.15,
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
