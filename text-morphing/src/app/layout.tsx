import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Text Morphing & Mask Reveal — Design Lab",
  description: "Cursor-driven text mask reveals, text scramble effects, and split-text animations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased noise`}>
        {children}
      </body>
    </html>
  );
}
