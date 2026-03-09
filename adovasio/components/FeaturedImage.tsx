"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedImage() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal reveal
      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );

      // Frame border animation
      gsap.fromTo(
        frameRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );

      // Parallax
      const img = imageRef.current?.querySelector("img");
      if (img) {
        gsap.fromTo(
          img,
          { y: "-10%" },
          {
            y: "10%",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-6 md:px-24">
      <div className="max-w-6xl mx-auto relative">
        {/* Decorative frame */}
        <div
          ref={frameRef}
          className="absolute -inset-4 md:-inset-8 border border-gold/10 pointer-events-none"
          style={{ opacity: 0 }}
        />

        <div
          ref={imageRef}
          className="relative aspect-[21/9] overflow-hidden"
        >
          <img
            src={images.featured}
            alt="Featured wedding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />

          {/* Overlay text */}
          <div className="absolute bottom-8 md:bottom-16 left-8 md:left-16">
            <p
              className="font-sans text-[10px] tracking-[0.4em] uppercase text-cream/50 mb-3"
              style={{ fontWeight: 300 }}
            >
              Featured Story
            </p>
            <h3
              className="font-serif text-2xl md:text-4xl text-cream/90 tracking-wide"
              style={{ fontWeight: 300 }}
            >
              Chiara & Marco
            </h3>
            <p
              className="font-serif text-sm text-cream/50 mt-2"
              style={{ fontWeight: 300, fontStyle: "italic" }}
            >
              Villa Balbianello, Lake Como
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
