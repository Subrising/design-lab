'use client';

import { useEffect, useState } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tighter" data-cursor-hover>
          <span className="text-neon-purple">BDSN</span>
          <span className="text-white/60">.club</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {['Work', 'Experiments', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-white/50 hover:text-neon-purple transition-colors duration-300 font-mono tracking-wider uppercase"
              data-cursor-hover
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
          <span className="text-xs text-white/40 font-mono">LIVE</span>
        </div>
      </div>
    </nav>
  );
}
