'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  category: string;
  year: string;
  color: string;
  description: string;
}

const projects: Project[] = [
  {
    title: 'Meridian',
    category: 'Branding / Web Design',
    year: '2025',
    color: '#FF3831',
    description: 'Complete rebrand and digital platform for a luxury hotel chain.',
  },
  {
    title: 'Sonance',
    category: 'UI/UX / Development',
    year: '2025',
    color: '#4A90D9',
    description: 'Music streaming platform with an immersive spatial audio experience.',
  },
  {
    title: 'Verdant',
    category: 'Brand Strategy / Design',
    year: '2024',
    color: '#2ECC71',
    description: 'Sustainable fashion brand identity and e-commerce platform.',
  },
  {
    title: 'Aurelius',
    category: 'Creative Direction',
    year: '2024',
    color: '#F39C12',
    description: 'Award-winning campaign for a contemporary art museum opening.',
  },
];

export default function WorkShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return;

    // Header reveal
    gsap.fromTo(
      headerRef.current.querySelectorAll('.reveal-item'),
      { y: 60, clipPath: 'inset(0 0 100% 0)' },
      {
        y: 0,
        clipPath: 'inset(0 0 0% 0)',
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
        },
      }
    );

    // Project cards animation
    projectRefs.current.forEach((el) => {
      if (!el) return;

      gsap.fromTo(
        el,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        }
      );

      // Parallax on image
      const img = el.querySelector('.project-img');
      if (img) {
        gsap.fromTo(
          img,
          { y: -30 },
          {
            y: 30,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="py-24 md:py-40 px-6 md:px-12 lg:px-20 section-dark"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="mb-20 md:mb-32">
          <div className="overflow-hidden">
            <p className="reveal-item text-red text-sm uppercase tracking-[0.3em] mb-4">
              Selected Work
            </p>
          </div>
          <div className="overflow-hidden">
            <h2
              className="reveal-item font-bold uppercase leading-[0.95]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}
            >
              Featured
              <br />
              <span className="text-cream/30">Projects</span>
            </h2>
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => { projectRefs.current[i] = el; }}
              className="project-card group relative"
              style={{ marginTop: i % 2 === 1 ? '80px' : '0' }}
            >
              {/* Project image placeholder */}
              <div className="project-image-wrapper relative aspect-[4/3] rounded-lg overflow-hidden mb-6">
                <div
                  className="project-img absolute inset-0 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${project.color}22, ${project.color}44)` }}
                >
                  <span
                    className="text-7xl md:text-9xl font-bold uppercase opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                    style={{ color: project.color }}
                  >
                    {project.title[0]}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/60 transition-all duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div
                      className="w-20 h-20 rounded-full border border-cream/40 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-cream group-hover:text-red transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-cream/50 text-sm mt-1">{project.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-cream/40 text-xs uppercase tracking-wider">{project.category}</p>
                  <p className="text-cream/30 text-xs mt-1">{project.year}</p>
                </div>
              </div>

              {/* Bottom line */}
              <div className="mt-6 h-[1px] bg-cream/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]" />
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-20 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-3 text-cream/60 hover:text-red transition-colors duration-300 text-sm uppercase tracking-[0.2em] group"
            data-magnetic
          >
            View All Projects
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
