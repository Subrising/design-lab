import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindMarket — SVG Path Drawing Showcase",
  description:
    "GSAP-powered SVG stroke-dasharray animations with scroll-triggered illustrations",
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
