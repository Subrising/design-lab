"use client";

import { CursorProvider } from "./components/CursorContext";
import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./components/SmoothScroll";
import Preloader from "./components/Preloader";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import ProjectsSection from "./components/ProjectsSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <CursorProvider>
      <SmoothScroll />
      <Preloader />
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        <ProjectsSection />
        <AboutSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </CursorProvider>
  );
}
