"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { images } from "@/lib/images";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Cinematic reveal: image scales up from slightly zoomed
      tl.fromTo(
        imageRef.current,
        { scale: 1.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2 }
      );

      // Title splits in with stagger
      const titleChars = titleRef.current?.querySelectorAll("span");
      if (titleChars) {
        tl.fromTo(
          titleChars,
          { y: 120, opacity: 0, rotateX: 40 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.08 },
          "-=1"
        );
      }

      // Subtitle fades in
      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.5"
      );

      // Scroll indicator pulses
      tl.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.3"
      );

      // Parallax on scroll
      gsap.to(imageRef.current, {
        y: "30%",
        scale: 1.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const title = "Adovasio";

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Full-bleed background image */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src={images.hero}
          alt="Wedding photography"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/40" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <h1
          ref={titleRef}
          className="text-6xl md:text-[10vw] leading-none tracking-[0.15em] uppercase font-serif"
          style={{
            fontWeight: 300,
            perspective: "600px",
          }}
        >
          {title.split("").map((char, i) => (
            <span key={i} className="inline-block">
              {char}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 font-sans text-xs md:text-sm tracking-[0.4em] uppercase text-cream/70"
          style={{ fontWeight: 300 }}
        >
          Wedding Photography &mdash; Italy
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span
          className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/50"
          style={{ fontWeight: 300 }}
        >
          Scroll
        </span>
        <div className="w-px h-12 bg-cream/30 relative overflow-hidden">
          <div className="w-full h-1/3 bg-gold absolute top-0 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
