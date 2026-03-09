"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images, stories } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

function GalleryItem({
  src,
  story,
  index,
}: {
  src: string;
  story: (typeof stories)[0];
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image clip-path reveal
      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.4,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Image parallax
      const img = imageRef.current?.querySelector("img");
      if (img) {
        gsap.fromTo(
          img,
          { y: "-15%", scale: 1.2 },
          {
            y: "15%",
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: itemRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // Text animation
      const text = itemRef.current?.querySelector("[data-text]");
      if (text) {
        gsap.fromTo(
          text,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: itemRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, itemRef);

    return () => ctx.revert();
  }, []);

  const isWide = index % 3 === 0;
  const isOffset = index % 2 !== 0;

  return (
    <div
      ref={itemRef}
      className={`
        relative mb-8 md:mb-0
        ${isWide ? "md:col-span-2" : "md:col-span-1"}
        ${isOffset ? "md:mt-24" : ""}
      `}
    >
      <div
        ref={imageRef}
        className={`relative overflow-hidden ${isWide ? "aspect-[16/9]" : "aspect-[3/4]"}`}
        data-cursor-hover
      >
        <img
          src={src}
          alt={story.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div data-text className="mt-6 px-1">
        <h3
          className="font-serif text-xl md:text-2xl text-cream/90 tracking-wide"
          style={{ fontWeight: 400 }}
        >
          {story.title}
        </h3>
        <p
          className="mt-2 font-sans text-[10px] tracking-[0.25em] uppercase text-warm-gray"
          style={{ fontWeight: 300 }}
        >
          {story.location} &mdash; {story.date}
        </p>
      </div>
    </div>
  );
}

export function ScrollGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-6 md:px-16">
      <div ref={headerRef} className="text-center mb-20 md:mb-32">
        <p
          className="font-sans text-[10px] tracking-[0.4em] uppercase text-warm-gray mb-4"
          style={{ fontWeight: 300 }}
        >
          Selected Works
        </p>
        <h2
          className="font-serif text-4xl md:text-6xl tracking-wide text-cream/90"
          style={{ fontWeight: 300 }}
        >
          Portfolio
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto">
        {images.gallery.slice(0, 5).map((src, i) => (
          <GalleryItem
            key={i}
            src={src}
            story={stories[i % stories.length]}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
