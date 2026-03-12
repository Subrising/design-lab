import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Lab — Cutting-Edge Web Experiments",
  description:
    "A curated collection of 60+ bleeding-edge web design experiments featuring GSAP, Three.js, WebGL, scroll animations, 3D physics, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
