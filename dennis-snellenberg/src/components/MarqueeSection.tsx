"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // First track: scroll-linked movement to the left
      if (track1Ref.current) {
        gsap.to(track1Ref.current, {
          xPercent: -25,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }

      // Second track: scroll-linked movement to the right
      if (track2Ref.current) {
        gsap.to(track2Ref.current, {
          xPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words1 = "Creative Developer — Interactive Experiences — Motion Design — ";
  const words2 = "Web Design — Brand Identity — Creative Direction — UI/UX — ";

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden border-y border-white/5 py-16"
    >
      <div ref={track1Ref} className="flex whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="mr-4 text-[clamp(3rem,8vw,8rem)] font-bold tracking-tighter text-white/5"
          >
            {words1}
          </span>
        ))}
      </div>

      <div ref={track2Ref} className="-ml-[30%] mt-4 flex whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="mr-4 text-[clamp(3rem,8vw,8rem)] font-bold tracking-tighter text-white/[0.03]"
          >
            {words2}
          </span>
        ))}
      </div>
    </section>
  );
}
