import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Immersive Garden — WebGL Scroll Experience",
  description:
    "A cinematic scroll-driven WebGL experience with 3D camera movement, GSAP shader transitions, and parallax storytelling.",
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
