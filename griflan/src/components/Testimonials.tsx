'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'Griflan transformed our digital presence completely. Their attention to detail and creative vision exceeded every expectation.',
    author: 'Sarah Chen',
    role: 'CEO, Meridian Hotels',
  },
  {
    quote: 'Working with the team felt like a true partnership. They understood our brand essence and translated it beautifully into digital.',
    author: 'Marcus Rivera',
    role: 'Founder, Sonance',
  },
  {
    quote: 'The results speak for themselves. Our engagement metrics doubled within the first month of launching the new platform.',
    author: 'Aisha Patel',
    role: 'CMO, Verdant',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      gsap.fromTo(
        el,
        { y: 60, opacity: 0, rotateX: 5 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-40 px-6 md:px-12 lg:px-20 section-light"
    >
      <div className="max-w-[1400px] mx-auto">
        <p className="text-red text-sm uppercase tracking-[0.3em] mb-16">Client Words</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="group p-8 md:p-10 rounded-xl border border-dark/10 hover:border-red/30 transition-colors duration-500 relative overflow-hidden"
            >
              {/* Hover background */}
              <div className="absolute inset-0 bg-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <svg className="w-8 h-8 text-red/30 mb-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>

                <p className="text-dark/80 text-lg leading-relaxed mb-8 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div>
                  <p className="text-dark font-semibold">{t.author}</p>
                  <p className="text-dark/50 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
