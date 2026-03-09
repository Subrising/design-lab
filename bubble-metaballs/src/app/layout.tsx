import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bubble Metaballs — GLSL Raymarching",
  description:
    "Three.js GLSL raymarched metaballs with SDF smooth-min blending, Fresnel rim lighting, and mouse interaction",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
