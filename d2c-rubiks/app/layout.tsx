import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D2C Life Science — Interactive Rubik's Cube",
  description:
    "Immersive 3D Rubik's cube experience with custom shaders and scroll-driven reveals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
