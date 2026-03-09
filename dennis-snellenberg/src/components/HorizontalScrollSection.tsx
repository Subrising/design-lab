"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    title: "Strategy",
    description: "Building digital products that balance user needs with business goals.",
    num: "01",
  },
  {
    title: "Design",
    description: "Crafting visual experiences that communicate brand personality.",
    num: "02",
  },
  {
    title: "Development",
    description: "Transforming designs into performant, accessible web experiences.",
    num: "03",
  },
  {
    title: "Motion",
    description: "Adding life and personality through purposeful animation.",
    num: "04",
  },
];

export default function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const totalWidth = trackRef.current.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="horizontal-scroll-section relative overflow-hidden"
    >
      <div ref={trackRef} className="flex">
        {slides.map((slide) => (
          <div
            key={slide.num}
            className="flex h-screen w-screen flex-shrink-0 flex-col justify-center px-16 md:px-32"
          >
            <span className="mb-4 text-sm tracking-widest text-[var(--color-highlight)]">
              {slide.num}
            </span>
            <h3 className="mb-6 text-[clamp(3rem,7vw,7rem)] font-light tracking-tighter">
              {slide.title}
            </h3>
            <p className="max-w-md text-lg text-[var(--color-text-muted)]">
              {slide.description}
            </p>

            {/* Decorative line */}
            <div className="mt-12 h-[1px] w-32 bg-gradient-to-r from-white/30 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}
