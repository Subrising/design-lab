import MorphNav from "@/components/MorphNav";
import Hero from "@/components/Hero";
import ScrollStory from "@/components/ScrollStory";
import PaymentFlow from "@/components/PaymentFlow";
import GlobalScale from "@/components/GlobalScale";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <MorphNav />
      <Hero />
      <ScrollStory />
      <PaymentFlow />
      <GlobalScale />
      <Footer />
    </main>
  );
}
