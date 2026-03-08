"use client";

import dynamic from "next/dynamic";

const KineticTypography = dynamic(() => import("@/components/KineticTypography"), { ssr: false });

export default function Home() {
  return (
    <main>
      <KineticTypography />
    </main>
  );
}
