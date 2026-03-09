"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Big title scale-in
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-bg-light)] px-8"
    >
      {/* Rounded top */}
      <div className="absolute top-0 left-0 w-full">
        <div
          className="h-[80px] w-full bg-[var(--color-bg)]"
          style={{ borderRadius: "0 0 50% 50%" }}
        />
      </div>

      <p className="mb-6 text-sm tracking-widest uppercase text-[var(--color-text-muted)]">
        Have a project in mind?
      </p>

      <h2
        ref={titleRef}
        className="text-center text-[clamp(3rem,10vw,10rem)] leading-[0.9] font-bold tracking-tighter"
      >
        {"Let's work".split("").map((char, i) => (
          <span key={i} className="inline-block transition-colors duration-300 hover:text-[var(--color-highlight)]">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
        <br />
        {"together".split("").map((char, i) => (
          <span key={i} className="inline-block transition-colors duration-300 hover:text-[var(--color-highlight)]">
            {char}
          </span>
        ))}
      </h2>

      <div className="mt-16" data-magnetic>
        <a
          href="mailto:hello@dennissnellenberg.com"
          className="magnetic-btn rounded-full border border-white/20 px-12 py-6 text-lg transition-colors hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)]"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
