"use client";

import dynamic from "next/dynamic";

const GalleryScene = dynamic(
  () => import("@/components/GalleryScene").then((m) => ({ default: m.GalleryScene })),
  { ssr: false }
);

export default function Home() {
  return <GalleryScene />;
}
