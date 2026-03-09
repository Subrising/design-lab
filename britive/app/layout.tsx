import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Britive — Premium SaaS Experience",
  description:
    "GSAP-powered section transitions, Three.js particles, Lenis smooth scrolling",
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
