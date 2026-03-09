'use client';

import { useLenis } from '@/hooks/useLenis';
import MagneticCursor from '@/components/MagneticCursor';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import WorkShowcase from '@/components/WorkShowcase';
import About from '@/components/About';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  useLenis();

  return (
    <>
      <PageTransition />
      <MagneticCursor />
      <Navigation />
      <main>
        <Hero />
        <Marquee />
        <WorkShowcase />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
