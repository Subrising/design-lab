"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements =
        sectionRef.current?.querySelectorAll("[data-animate]");
      if (!elements) return;

      elements.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 md:py-48 px-6 md:px-24 bg-soft-white/[0.03]"
    >
      <div className="max-w-3xl mx-auto text-center">
        <div data-animate className="divider mx-auto mb-12" />

        <svg
          data-animate
          className="mx-auto mb-8 text-gold/30"
          width="40"
          height="32"
          viewBox="0 0 40 32"
          fill="currentColor"
        >
          <path d="M0 32V19.2C0 6.4 8 0 17.6 0v6.4C12.8 7.2 9.6 11.2 9.6 16H16v16H0zm22.4 0V19.2C22.4 6.4 30.4 0 40 0v6.4c-4.8.8-8 4.8-8 9.6h6.4v16H22.4z" />
        </svg>

        <blockquote
          data-animate
          className="font-serif text-xl md:text-3xl leading-relaxed text-cream/80 tracking-wide"
          style={{ fontWeight: 300, fontStyle: "italic" }}
        >
          &ldquo;The images captured our souls, not just our faces. Every time
          we look at them, we fall in love all over again.&rdquo;
        </blockquote>

        <div data-animate className="mt-10">
          <p
            className="font-sans text-sm tracking-[0.2em] uppercase text-cream/60"
            style={{ fontWeight: 400 }}
          >
            Chiara & Marco
          </p>
          <p
            className="font-sans text-[10px] tracking-[0.2em] text-warm-gray mt-1"
            style={{ fontWeight: 300 }}
          >
            Lake Como, Italy
          </p>
        </div>
      </div>
    </section>
  );
}
