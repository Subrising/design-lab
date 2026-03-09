"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomCursor from "@/components/ui/CustomCursor";
import Navigation from "@/components/ui/Navigation";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import HeroSection from "@/components/sections/HeroSection";
import WorkSection from "@/components/sections/WorkSection";
import AboutSection from "@/components/sections/AboutSection";
import LabsSection from "@/components/sections/LabsSection";
import ContactSection from "@/components/sections/ContactSection";

gsap.registerPlugin(ScrollTrigger);

const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [morphProgress, setMorphProgress] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: mainRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setMorphProgress(self.progress);
        },
      });

      const sections = ["#work", "#about", "#labs", "#contact"];
      sections.forEach((selector, i) => {
        const el = document.querySelector(selector);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveSection(i + 1),
          onEnterBack: () => setActiveSection(i + 1),
          onLeaveBack: () => setActiveSection(i),
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setTransitionProgress(1);
    const timer = setTimeout(() => {
      gsap.to({ value: 1 }, {
        value: 0,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: function () {
          setTransitionProgress(this.targets()[0].value);
        },
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={mainRef} className="relative">
      <CustomCursor />
      <Navigation />
      <ScrollIndicator />
      <Scene
        activeSection={activeSection}
        morphProgress={morphProgress}
        transitionProgress={transitionProgress}
      />
      <div className="noise-overlay" />
      <main className="relative z-10">
        <HeroSection />
        <WorkSection />
        <AboutSection />
        <LabsSection />
        <ContactSection />
      </main>
    </div>
  );
}
