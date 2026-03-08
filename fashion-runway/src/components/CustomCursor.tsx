"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power3.out" });
    };

    const onEnter = () => cursor.classList.add("hover");
    const onLeave = () => cursor.classList.remove("hover");

    window.addEventListener("mousemove", onMove);

    const hoverEls = document.querySelectorAll("a, button, .product-card, .lookbook-item, .magnetic-btn");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // Re-bind on DOM changes
    const observer = new MutationObserver(() => {
      const newEls = document.querySelectorAll("a, button, .product-card, .lookbook-item, .magnetic-btn");
      newEls.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}
