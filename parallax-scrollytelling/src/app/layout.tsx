import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Parallax Scrollytelling — Design Lab",
  description: "A cinematic scroll-driven narrative experience built with GSAP ScrollTrigger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased noise-overlay`}>
        {children}
      </body>
    </html>
  );
}
