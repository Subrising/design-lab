"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { IntroSection } from "@/components/IntroSection";
import { ScrollGallery } from "@/components/ScrollGallery";
import { PhotoSequence } from "@/components/PhotoSequence";
import { FeaturedImage } from "@/components/FeaturedImage";
import { Lightbox } from "@/components/Lightbox";
import { Testimonial } from "@/components/Testimonial";
import { Footer } from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger after all images load
    const imgs = document.querySelectorAll("img");
    let loaded = 0;
    const total = imgs.length;

    const onLoad = () => {
      loaded++;
      if (loaded >= total) {
        ScrollTrigger.refresh();
      }
    };

    imgs.forEach((img) => {
      if (img.complete) {
        onLoad();
      } else {
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onLoad);
      }
    });

    return () => {
      imgs.forEach((img) => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onLoad);
      });
    };
  }, []);

  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <IntroSection />
      <ScrollGallery />
      <PhotoSequence />
      <FeaturedImage />
      <Lightbox />
      <Testimonial />
      <Footer />
    </main>
  );
}
