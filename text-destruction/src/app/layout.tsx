import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Text Destruction — Particle Text Experiment",
  description: "Interactive text destruction with instanced Three.js particles, click-to-explode, physics-based reformation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
