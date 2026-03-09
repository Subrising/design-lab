"use client";

import { useCallback, useRef, useState } from "react";
import WebGLCanvas from "@/components/WebGLCanvas";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollSections from "@/components/ScrollSections";
import Footer from "@/components/Footer";
import { useLenis, type LenisScrollData } from "@/hooks/useLenis";
import { useMouse } from "@/hooks/useMouse";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const { smoothMouse } = useMouse();
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  // Use refs to avoid re-renders on every scroll frame
  const progressRef = useRef(0);
  const velocityRef = useRef(0);

  const handleScroll = useCallback((data: LenisScrollData) => {
    progressRef.current = data.progress;
    velocityRef.current = data.velocity;
    // Only update state at a throttled rate for DOM updates
    setScrollProgress(data.progress);
    setScrollVelocity(data.velocity);
  }, []);

  useLenis(handleScroll);

  // Update mouse refs for WebGL (avoids re-renders)
  mouseXRef.current = smoothMouse.current.normalizedX;
  mouseYRef.current = smoothMouse.current.normalizedY;

  return (
    <main className="relative">
      <WebGLCanvas
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        mouseX={smoothMouse.current.normalizedX}
        mouseY={smoothMouse.current.normalizedY}
      />

      <Header />

      <Hero />

      <ScrollSections />

      <Footer />
    </main>
  );
}
