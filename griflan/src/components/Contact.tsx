'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Heading reveal
    if (headingRef.current) {
      const lines = headingRef.current.querySelectorAll('.contact-line');
      gsap.fromTo(
        lines,
        { y: 80, clipPath: 'inset(0 0 100% 0)' },
        {
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 75%',
          },
        }
      );
    }

    // CTA button
    gsap.fromTo(
      sectionRef.current.querySelector('.cta-btn'),
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current.querySelector('.cta-btn'),
          start: 'top 90%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-32 md:py-48 px-6 md:px-12 lg:px-20 section-dark relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, #FF3831 0%, transparent 70%)' }}
      />

      <div className="max-w-[1400px] mx-auto text-center relative z-10">
        <p className="text-red text-sm uppercase tracking-[0.3em] mb-12">Get In Touch</p>

        <div ref={headingRef}>
          <div className="overflow-hidden">
            <h2
              className="contact-line font-bold uppercase leading-[0.95]"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 9rem)' }}
            >
              Let&apos;s create
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2
              className="contact-line font-bold uppercase leading-[0.95] italic text-red"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 9rem)' }}
            >
              something
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2
              className="contact-line font-bold uppercase leading-[0.95]"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 9rem)' }}
            >
              awesome
            </h2>
          </div>
        </div>

        <div className="mt-16">
          <a
            href="mailto:hello@griflan.com"
            className="cta-btn inline-flex items-center gap-4 bg-red text-dark px-10 py-5 rounded-full text-lg font-bold uppercase tracking-wider hover:bg-cream transition-all duration-500 group"
            data-magnetic
          >
            Start a Project
            <svg
              className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>

        <p className="mt-8 text-cream/40 text-sm">
          hello@griflan.com
        </p>
      </div>
    </section>
  );
}
