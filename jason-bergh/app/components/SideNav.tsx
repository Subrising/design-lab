"use client";

import { useEffect, useState } from "react";

interface SideNavProps {
  sectionCount: number;
}

export default function SideNav({ sectionCount }: SideNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const index = Math.round(scrollY / windowH);
      setActiveIndex(Math.min(index, sectionCount - 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionCount]);

  const scrollTo = (index: number) => {
    window.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <nav className="side-nav">
      {Array.from({ length: sectionCount }).map((_, i) => (
        <button
          key={i}
          className={`side-nav-dot ${i === activeIndex ? "active" : ""}`}
          onClick={() => scrollTo(i)}
          aria-label={`Go to section ${i + 1}`}
        />
      ))}
    </nav>
  );
}
