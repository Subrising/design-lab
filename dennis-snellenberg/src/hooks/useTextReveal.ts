"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useTextReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(".reveal-text");

    elements.forEach((el) => {
      const text = el.textContent || "";
      const words = text.split(" ");

      // Clear existing content safely
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }

      words.forEach((word, i) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";
        wordSpan.style.overflow = "hidden";
        wordSpan.style.verticalAlign = "top";

        const inner = document.createElement("span");
        inner.textContent = word;
        inner.style.display = "inline-block";
        inner.style.transform = "translateY(110%)";
        inner.className = "word-inner";

        wordSpan.appendChild(inner);
        el.appendChild(wordSpan);

        if (i < words.length - 1) {
          el.appendChild(document.createTextNode("\u00A0"));
        }
      });

      const wordInners = el.querySelectorAll(".word-inner");

      gsap.to(wordInners, {
        y: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return containerRef;
}
