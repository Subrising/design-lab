'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Big text reveal word by word
    if (textRef.current) {
      const words = textRef.current.querySelectorAll('.word');
      gsap.fromTo(
        words,
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 1,
          },
        }
      );
    }

    // Stats counter animation
    if (statsRef.current) {
      const statEls = statsRef.current.querySelectorAll('.stat-number');
      statEls.forEach((el) => {
        const target = parseInt(el.getAttribute('data-target') || '0');
        gsap.fromTo(
          el,
          { innerText: '0' },
          {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          }
        );
      });

      // Stats fade in
      gsap.fromTo(
        statsRef.current.querySelectorAll('.stat-item'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const aboutText =
    'We are a collective of designers, developers, and strategists who believe in the power of thoughtful digital experiences to transform brands and drive meaningful connections.';

  const stats = [
    { number: 150, label: 'Projects Delivered', suffix: '+' },
    { number: 8, label: 'Years Experience', suffix: '' },
    { number: 40, label: 'Awards Won', suffix: '+' },
    { number: 12, label: 'Team Members', suffix: '' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-32 md:py-48 px-6 md:px-12 lg:px-20 section-light relative overflow-hidden"
    >
      {/* Decorative circle */}
      <div className="absolute -right-32 top-1/4 w-64 h-64 rounded-full border border-dark/10" />
      <div className="absolute -left-16 bottom-1/4 w-96 h-96 rounded-full border border-dark/5" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <p className="text-red text-sm uppercase tracking-[0.3em] mb-12">About Us</p>

        {/* Big reveal text */}
        <div
          ref={textRef}
          className="mb-24 md:mb-32"
          style={{ fontSize: 'clamp(1.8rem, 4.5vw, 4rem)', lineHeight: 1.3, fontWeight: 500 }}
        >
          {aboutText.split(' ').map((word, i) => (
            <span key={i} className="word inline-block mr-[0.3em]" style={{ color: '#181616' }}>
              {word}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item">
              <div className="flex items-baseline">
                <span
                  className="stat-number text-5xl md:text-6xl font-bold text-dark"
                  data-target={stat.number}
                >
                  0
                </span>
                {stat.suffix && (
                  <span className="text-red text-3xl md:text-4xl font-bold ml-1">{stat.suffix}</span>
                )}
              </div>
              <p className="text-dark/50 text-sm uppercase tracking-wider mt-2">{stat.label}</p>
              <div className="mt-3 h-[1px] bg-dark/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
