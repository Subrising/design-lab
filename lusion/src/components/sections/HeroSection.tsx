"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 120, opacity: 0, skewY: 5 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.4, ease: "power4.out", delay: 0.3 }
      );
      gsap.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 0.6, duration: 1, ease: "power3.out", delay: 0.8 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center z-10">
      <div className="text-center px-8">
        <h1 ref={titleRef} className="section-title gradient-text opacity-0">
          Creating
          <br />
          <span className="italic font-extralight">Digital</span>
          <br />
          Experiences
        </h1>
        <p ref={subtitleRef} className="mt-8 text-sm tracking-[0.25em] uppercase text-white/40 max-w-md mx-auto opacity-0">
          Award-winning studio crafting immersive WebGL experiences
        </p>
      </div>
    </section>
  );
}
