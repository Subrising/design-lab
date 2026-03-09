'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Animate each heading line
    headingRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(
        el,
        { clipPath: 'inset(0 0 100% 0)', y: 60 },
        {
          clipPath: 'inset(0 0 0% 0)',
          y: 0,
          duration: 1,
          ease: 'power4.out',
        },
        i * 0.15
      );
    });

    // Subtitle fade in
    if (subRef.current) {
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );
    }

    // Scroll indicator
    if (scrollIndicatorRef.current) {
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.3'
      );

      // Bounce animation
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: 'power1.inOut',
        delay: 2,
      });
    }
  }, []);

  const headingLines = ['We craft', 'digital', 'experiences'];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 section-dark overflow-hidden"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#FFFBDB 1px, transparent 1px), linear-gradient(90deg, #FFFBDB 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 max-w-[1400px] mx-auto w-full pt-32">
        {headingLines.map((line, i) => (
          <div key={i} className="overflow-hidden">
            <div
              ref={(el) => { headingRefs.current[i] = el; }}
              className="flex items-baseline gap-4 md:gap-6"
            >
              <h1
                className="font-bold uppercase leading-[0.9] tracking-tight"
                style={{
                  fontSize: 'clamp(3rem, 12vw, 11rem)',
                  color: i === 1 ? '#FF3831' : '#FFFBDB',
                  fontStyle: i === 2 ? 'italic' : 'normal',
                }}
              >
                {line}
              </h1>
              {i === 0 && (
                <span className="text-cream/40 text-lg md:text-xl font-light hidden md:block">
                  (since 2018)
                </span>
              )}
            </div>
          </div>
        ))}

        <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <p
            ref={subRef}
            className="text-cream/60 text-base md:text-lg max-w-md leading-relaxed"
          >
            A creative studio focused on brand strategy, digital design, and
            development for forward-thinking companies.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#work"
              className="text-dark bg-red px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-cream transition-all duration-500"
              data-magnetic
            >
              View Work
            </a>
            <a
              href="#about"
              className="text-cream/70 text-sm uppercase tracking-wider hover-line hover:text-cream transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-cream/40 text-xs uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-cream/40 to-transparent" />
      </div>
    </section>
  );
}
