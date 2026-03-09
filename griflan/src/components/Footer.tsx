'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    gsap.fromTo(
      footerRef.current.querySelectorAll('.footer-reveal'),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const socialLinks = ['Twitter', 'Instagram', 'Dribbble', 'LinkedIn'];
  const quickLinks = ['Work', 'About', 'Services', 'Contact'];

  return (
    <footer
      ref={footerRef}
      className="py-16 md:py-24 px-6 md:px-12 lg:px-20 section-dark border-t border-cream/10"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 footer-reveal">
            <a href="#" className="text-cream text-3xl font-bold tracking-tight">
              griflan
            </a>
            <p className="text-cream/40 mt-4 max-w-sm text-sm leading-relaxed">
              A creative studio crafting digital experiences that drive results. Based in London, working globally.
            </p>
          </div>

          <div className="footer-reveal">
            <p className="text-cream/60 text-xs uppercase tracking-[0.2em] mb-4">Navigate</p>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-cream/40 hover:text-cream transition-colors duration-300 text-sm hover-line"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-reveal">
            <p className="text-cream/60 text-xs uppercase tracking-[0.2em] mb-4">Connect</p>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-cream/40 hover:text-cream transition-colors duration-300 text-sm hover-line"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-reveal flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-cream/10">
          <p className="text-cream/30 text-xs">
            &copy; 2026 Griflan. All rights reserved.
          </p>
          <p className="text-cream/30 text-xs">
            Designed with <span className="text-red">awesome sauce</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
