"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: false });
const MarqueeStrip = dynamic(() => import("@/components/MarqueeStrip"), { ssr: false });
const EditorialSection = dynamic(() => import("@/components/EditorialSection"), { ssr: false });
const CollectionScroll = dynamic(() => import("@/components/CollectionScroll"), { ssr: false });
const LookbookGrid = dynamic(() => import("@/components/LookbookGrid"), { ssr: false });
const FooterSection = dynamic(() => import("@/components/FooterSection"), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <div className="noise">
        <CustomCursor />
        <HeroSection />
        <MarqueeStrip />
        <EditorialSection />
        <CollectionScroll />
        <LookbookGrid />
        <FooterSection />
      </div>
    </SmoothScroll>
  );
}
