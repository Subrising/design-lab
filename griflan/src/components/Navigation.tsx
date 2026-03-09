'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Nav scroll effect
    let lastScroll = 0;
    const handleScroll = () => {
      const nav = navRef.current;
      if (!nav) return;
      const currentScroll = window.scrollY;
      if (currentScroll > 100) {
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.background = 'rgba(24,22,22,0.85)';
      } else {
        nav.style.backdropFilter = 'none';
        nav.style.background = 'transparent';
      }
      if (currentScroll > lastScroll && currentScroll > 200) {
        gsap.to(nav, { y: -100, duration: 0.3 });
      } else {
        gsap.to(nav, { y: 0, duration: 0.3 });
      }
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    const links = menuRef.current.querySelectorAll('.menu-link');

    if (menuOpen) {
      gsap.to(menuRef.current, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.6,
        ease: 'power3.inOut',
      });
      gsap.fromTo(
        links,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.3, ease: 'power3.out' }
      );
    } else {
      gsap.to(menuRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5,
        ease: 'power3.inOut',
      });
    }
  }, [menuOpen]);

  const navLinks = ['Work', 'About', 'Services', 'Articles', 'Contact'];

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-5 flex items-center justify-between"
        style={{ transition: 'background 0.3s ease' }}
      >
        <a href="#" className="text-cream text-xl font-bold tracking-tight hover-line" data-magnetic>
          griflan
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-cream/70 text-sm uppercase tracking-widest hover:text-cream transition-colors duration-300 hover-line"
            >
              {link}
            </a>
          ))}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 z-[200]"
          data-magnetic
        >
          <span
            className="block w-6 h-[2px] bg-cream transition-transform duration-300"
            style={{
              transform: menuOpen ? 'rotate(45deg) translateY(5px)' : 'none',
            }}
          />
          <span
            className="block w-6 h-[2px] bg-cream transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-[2px] bg-cream transition-transform duration-300"
            style={{
              transform: menuOpen ? 'rotate(-45deg) translateY(-5px)' : 'none',
            }}
          />
        </button>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="text-dark bg-red px-5 py-2.5 rounded-full text-sm font-medium hover:bg-cream hover:text-dark transition-all duration-300"
            data-magnetic
          >
            Let&apos;s Talk
          </a>
        </div>
      </nav>

      {/* Full screen mobile menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[150] bg-dark flex flex-col items-center justify-center gap-8 md:hidden"
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      >
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
            className="menu-link text-cream text-4xl font-bold uppercase tracking-wide hover:text-red transition-colors duration-300"
          >
            {link}
          </a>
        ))}
      </div>
    </>
  );
}
