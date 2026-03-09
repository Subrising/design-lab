"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicBars() {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!topRef.current || !bottomRef.current) return;

    // Bars appear during project sections (between hero and footer)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    // Animate cinematic bars in and out
    tl.fromTo(
      [topRef.current, bottomRef.current],
      { height: 0 },
      { height: "4vh", duration: 0.1 },
      0.05
    ).to(
      [topRef.current, bottomRef.current],
      { height: 0, duration: 0.1 },
      0.9
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <div ref={topRef} className="cinematic-bar cinematic-bar--top" />
      <div ref={bottomRef} className="cinematic-bar cinematic-bar--bottom" />
    </>
  );
}
