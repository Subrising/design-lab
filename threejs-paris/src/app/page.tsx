"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import SpeakerCards from "@/components/SpeakerCards";
import Schedule from "@/components/Schedule";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroScene />
      <SpeakerCards />
      <Schedule />
      <Sponsors />
      <Footer />
    </main>
  );
}
