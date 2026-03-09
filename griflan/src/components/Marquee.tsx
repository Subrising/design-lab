'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!track1Ref.current || !track2Ref.current || !containerRef.current) return;

    // Scroll-driven speed change
    gsap.to(track1Ref.current, {
      x: '-50%',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    gsap.to(track2Ref.current, {
      x: '0%',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, []);

  const words = ['Design', '✦', 'Development', '✦', 'Strategy', '✦', 'Branding', '✦'];
  const repeatedWords = [...words, ...words, ...words, ...words];

  return (
    <div ref={containerRef} className="py-16 md:py-24 overflow-hidden section-dark border-y border-cream/10">
      <div ref={track1Ref} className="flex whitespace-nowrap mb-4" style={{ transform: 'translateX(0%)' }}>
        {repeatedWords.map((word, i) => (
          <span
            key={i}
            className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase mx-4 md:mx-8"
            style={{ color: word === '✦' ? '#FF3831' : '#FFFBDB', opacity: word === '✦' ? 1 : 0.15 }}
          >
            {word}
          </span>
        ))}
      </div>
      <div ref={track2Ref} className="flex whitespace-nowrap" style={{ transform: 'translateX(-50%)' }}>
        {repeatedWords.map((word, i) => (
          <span
            key={i}
            className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase mx-4 md:mx-8"
            style={{ color: word === '✦' ? '#FF3831' : '#FFFBDB', opacity: word === '✦' ? 1 : 0.2 }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
