import Navbar from "@/components/Navbar";
import GradientOrbs from "@/components/GradientOrbs";
import Hero from "@/components/Hero";
import LiveComponentDemo from "@/components/LiveComponentDemo";
import BentoGrid from "@/components/BentoGrid";
import DeveloperExperience from "@/components/DeveloperExperience";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GradientOrbs />
      <Navbar />
      <Hero />
      <LiveComponentDemo />
      <BentoGrid />
      <DeveloperExperience />
      <Pricing />
      <Footer />
    </main>
  );
}
