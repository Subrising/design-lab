"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { id: "prologue", label: "Prologue" },
  { id: "chapter-1", label: "Discovery" },
  { id: "chapter-2", label: "Descent" },
  { id: "chapter-3", label: "Revelation" },
  { id: "epilogue", label: "Epilogue" },
];

export default function ProgressNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    chapters.forEach((ch, i) => {
      const el = document.getElementById(ch.id);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
      });
    });
  }, []);

  return (
    <div className="story-progress">
      {chapters.map((ch, i) => (
        <div
          key={ch.id}
          className={`progress-dot ${i === active ? "active" : ""}`}
          data-label={ch.label}
          onClick={() => {
            const el = document.getElementById(ch.id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
      ))}
    </div>
  );
}
