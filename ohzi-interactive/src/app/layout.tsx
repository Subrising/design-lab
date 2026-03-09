import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OHZI Interactive Studio | Digital Magic",
  description:
    "Immersive 3D web experiences crafted with WebGL, Three.js, and custom GLSL shaders.",
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
