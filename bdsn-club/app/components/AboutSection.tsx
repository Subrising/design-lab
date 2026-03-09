'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.fade-up');
            gsap.fromTo(
              elements,
              { y: 60, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out' }
            );
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative z-10 px-8 py-32 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="fade-up text-neon-purple text-sm font-mono tracking-widest uppercase mb-4">
            About
          </p>
          <h2 className="fade-up text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            Where <span className="glow-text">code</span> meets{' '}
            <span className="glow-text-blue">art</span>
          </h2>
          <p className="fade-up text-lg text-white/50 leading-relaxed mb-6">
            BDSN is a collective of digital artists and creative developers pushing the
            boundaries of interactive web experiences. We craft generative art, WebGL
            experiments, and immersive digital environments.
          </p>
          <p className="fade-up text-lg text-white/50 leading-relaxed">
            Every pixel is computed, every movement is reactive, every state is unique.
            Our work lives at the intersection of mathematics, design, and technology.
          </p>
        </div>

        <div className="fade-up grid grid-cols-2 gap-6">
          {[
            { label: 'Experiments', value: '120+' },
            { label: 'Shaders', value: '340+' },
            { label: 'Lines of GLSL', value: '50K+' },
            { label: 'FPS Target', value: '60' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="gradient-border rounded-xl p-6 bg-surface-light text-center"
            >
              <div className="text-3xl font-bold text-neon-purple mb-2">{stat.value}</div>
              <div className="text-xs text-white/40 font-mono uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
