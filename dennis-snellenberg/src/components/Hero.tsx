"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title entrance — staggered character reveal
      const chars = titleRef.current?.querySelectorAll(".char");
      if (chars) {
        gsap.fromTo(
          chars,
          { y: 120, opacity: 0, rotateX: -80 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.03,
            ease: "power4.out",
            delay: 0.8,
          }
        );
      }

      // Subtitle fade
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1.5 }
        );
      }

      // Scroll indicator pulse
      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, delay: 2, ease: "power2.out" }
        );
        gsap.to(scrollIndicatorRef.current, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: 2,
        });
      }

      // Parallax on scroll
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          yPercent: -50,
          opacity: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const titleText = "Creative Developer";
  const chars = titleText.split("");

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-bg)]" />

      <h1
        ref={titleRef}
        className="relative z-10 text-center text-[clamp(3rem,10vw,10rem)] leading-[0.9] font-bold tracking-tighter"
        style={{ perspective: "1000px" }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="char inline-block"
            style={{ transformOrigin: "center bottom" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>

      <p
        ref={subtitleRef}
        className="relative z-10 mt-8 max-w-lg text-center text-lg text-[var(--color-text-muted)]"
      >
        Freelance designer &amp; developer focused on
        <br />
        creating interactive digital experiences
      </p>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest uppercase text-[var(--color-text-muted)]">
          Scroll
        </span>
        <div className="h-12 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
