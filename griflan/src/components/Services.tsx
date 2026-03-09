'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: '01',
    title: 'Brand Strategy',
    description: 'We define your brand\'s core identity, positioning, and messaging to create a foundation for authentic connection.',
    tags: ['Research', 'Positioning', 'Voice & Tone', 'Guidelines'],
  },
  {
    number: '02',
    title: 'Digital Design',
    description: 'Crafting pixel-perfect interfaces that balance aesthetics with usability, creating experiences users love.',
    tags: ['UI/UX', 'Web Design', 'Mobile', 'Design Systems'],
  },
  {
    number: '03',
    title: 'Development',
    description: 'Building performant, scalable digital products with modern technologies and best practices.',
    tags: ['Frontend', 'Backend', 'CMS', 'E-commerce'],
  },
  {
    number: '04',
    title: 'Motion & 3D',
    description: 'Bringing brands to life through animation, interaction design, and immersive 3D experiences.',
    tags: ['Animation', 'WebGL', '3D', 'Interaction'],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Section header
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.section-header-reveal'),
      { y: 50, clipPath: 'inset(0 0 100% 0)' },
      {
        y: 0,
        clipPath: 'inset(0 0 0% 0)',
        duration: 1,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    );

    // Service items
    itemRefs.current.forEach((el) => {
      if (!el) return;

      // Line expand
      const line = el.querySelector('.service-line');
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          }
        );
      }

      // Content reveal
      gsap.fromTo(
        el.querySelectorAll('.service-reveal'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
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
      id="services"
      ref={sectionRef}
      className="py-24 md:py-40 px-6 md:px-12 lg:px-20 section-dark"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <div className="mb-20 md:mb-28 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="overflow-hidden">
              <p className="section-header-reveal text-red text-sm uppercase tracking-[0.3em] mb-4">
                What We Do
              </p>
            </div>
            <div className="overflow-hidden">
              <h2
                className="section-header-reveal font-bold uppercase leading-[0.95]"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}
              >
                Our
                <br />
                <span className="italic text-cream/30">Services</span>
              </h2>
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="section-header-reveal text-cream/50 max-w-sm text-base leading-relaxed">
              We offer end-to-end creative services to help brands stand out in the digital landscape.
            </p>
          </div>
        </div>

        {/* Service items */}
        <div>
          {services.map((service, i) => (
            <div
              key={service.number}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="group py-8 md:py-12"
            >
              <div className="service-line h-[1px] bg-cream/15 mb-8 md:mb-12 origin-left" />

              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                <span className="service-reveal text-red/60 text-sm font-mono">{service.number}</span>

                <div className="flex-1">
                  <h3 className="service-reveal text-3xl md:text-5xl font-bold text-cream group-hover:text-red transition-colors duration-500">
                    {service.title}
                  </h3>
                </div>

                <div className="flex-1">
                  <p className="service-reveal text-cream/50 text-base leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="service-reveal flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs uppercase tracking-wider text-cream/40 border border-cream/10 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <svg
                  className="service-reveal w-6 h-6 text-cream/30 group-hover:text-red group-hover:rotate-45 transition-all duration-500 shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
