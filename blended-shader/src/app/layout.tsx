import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blended Shader — GLSL Material Transitions",
  description:
    "Interactive Three.js demo with custom GLSL shaders blending metallic, glass, and organic materials based on mouse position.",
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
