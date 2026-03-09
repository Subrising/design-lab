'use client';

import dynamic from 'next/dynamic';
import Navigation from './components/Navigation';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';

const GenerativeHero = dynamic(() => import('./components/GenerativeHero'), { ssr: false });
const NoiseBackground = dynamic(() => import('./components/NoiseBackground'), { ssr: false });
const GenerativeShowcase = dynamic(() => import('./components/GenerativeShowcase'), { ssr: false });
const CustomCursor = dynamic(() => import('./components/CustomCursor'), { ssr: false });

export default function Home() {
  return (
    <>
      <CustomCursor />
      <NoiseBackground />
      <div className="noise-overlay" />

      <Navigation />

      {/* Hero Section */}
      <section id="work" className="relative h-screen flex items-center justify-center overflow-hidden">
        <GenerativeHero />

        <div className="relative z-10 text-center px-8">
          <p className="text-neon-purple text-sm font-mono tracking-[0.3em] uppercase mb-6 opacity-80">
            Creative Collective
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none mb-6">
            <span className="block glow-text">BDSN</span>
            <span className="block text-white/20 text-4xl md:text-5xl lg:text-6xl font-light tracking-wider mt-2">
              .club
            </span>
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed mb-12">
            Generative art &amp; interactive experiments.
            <br />
            Where mathematics becomes visual poetry.
          </p>

          <div className="flex items-center justify-center gap-8">
            <a
              href="#experiments"
              className="px-8 py-3 bg-neon-purple/10 border border-neon-purple/30 rounded-full text-neon-purple text-sm font-mono hover:bg-neon-purple/20 transition-all duration-300"
              data-cursor-hover
            >
              Explore
            </a>
            <a
              href="#about"
              className="text-white/40 text-sm font-mono hover:text-white/80 transition-colors duration-300"
              data-cursor-hover
            >
              Learn more →
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs font-mono text-white/40 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-neon-purple to-transparent" />
        </div>
      </section>

      {/* Experiments Section */}
      <div id="experiments">
        <GenerativeShowcase />
      </div>

      {/* Manifesto Section */}
      <section className="relative z-10 px-8 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-neon-blue text-sm font-mono tracking-widest uppercase mb-8">
            Manifesto
          </p>
          <blockquote className="text-3xl md:text-5xl font-bold text-white/80 leading-tight">
            &ldquo;We don&apos;t design screens.
            <br />
            We design <span className="glow-text">systems</span> that
            <br />
            <span className="glow-text-blue">breathe</span>.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 px-8 py-24 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-12 items-center">
            {[
              'Three.js',
              'WebGL',
              'GLSL',
              'React Three Fiber',
              'Simplex Noise',
              'FBM',
              'GSAP',
              'Next.js',
            ].map((tech) => (
              <span
                key={tech}
                className="text-white/20 hover:text-neon-purple text-sm font-mono tracking-wider transition-colors duration-300 uppercase"
                data-cursor-hover
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <AboutSection />
      <Footer />
    </>
  );
}
