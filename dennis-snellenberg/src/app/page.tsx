"use client";
import { useState, useCallback } from "react";
import { useLenis } from "@/hooks/useLenis";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MarqueeSection from "@/components/MarqueeSection";
import ProjectsSection from "@/components/ProjectsSection";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <MarqueeSection />
        <ProjectsSection />
        <HorizontalScrollSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
