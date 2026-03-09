'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function PageTransition() {
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!maskRef.current) return;

    // Page load reveal - radial mask effect
    const tl = gsap.timeline();

    tl.fromTo(
      maskRef.current,
      {
        clipPath: 'circle(150% at 50% 50%)',
      },
      {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 1.2,
        ease: 'power3.inOut',
        delay: 0.1,
      }
    );

    tl.set(maskRef.current, { display: 'none' });
  }, []);

  return (
    <div
      ref={maskRef}
      className="page-mask"
      style={{ background: '#FF3831' }}
    />
  );
}
