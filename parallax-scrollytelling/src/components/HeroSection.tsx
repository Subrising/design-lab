"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return;

    // Entrance animation
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(titleRef.current.querySelectorAll(".word"), {
      y: 100,
      opacity: 0,
      rotateX: -90,
      stagger: 0.08,
      duration: 1.2,
      ease: "power4.out",
    })
      .from(
        subtitleRef.current,
        { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )
      .from(
        scrollCueRef.current,
        { opacity: 0, y: 20, duration: 0.6 },
        "-=0.2"
      );

    // Parallax exit on scroll
    gsap.to(titleRef.current, {
      y: -200,
      opacity: 0,
      scale: 0.8,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(subtitleRef.current, {
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "60% top",
        scrub: true,
      },
    });
  }, []);

  const words = ["The", "Art", "of", "Motion"];

  return (
    <section
      ref={sectionRef}
      className="section-full relative"
      style={{ perspective: "1000px" }}
    >
      {/* Background orbs */}
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, #6366f1, transparent)",
          top: "20%",
          left: "10%",
        }}
      />
      <div
        className="orb"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, #a855f7, transparent)",
          bottom: "20%",
          right: "15%",
          animationDelay: "2s",
        }}
      />

      <div className="relative z-10 text-center px-6">
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-glow"
          style={{ transformStyle: "preserve-3d" }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              className="word inline-block mx-2 md:mx-4"
              style={{ display: "inline-block" }}
            >
              {word === "Motion" ? (
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {word}
                </span>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="mt-8 text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          A cinematic journey through scroll-driven animation, parallax depth,
          and interactive storytelling.
        </p>

        <div
          ref={scrollCueRef}
          className="mt-16 flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-sm uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
