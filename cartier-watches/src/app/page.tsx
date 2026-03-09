"use client";

import { useEffect, useRef } from "react";
import { WatchScene } from "@/components/WatchScene";
import { ScrollSections } from "@/components/ScrollSections";
import { Navbar } from "@/components/Navbar";
import { Preloader } from "@/components/Preloader";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef}>
      <Preloader />
      <Navbar />
      <WatchScene />
      <ScrollSections />
    </div>
  );
}
