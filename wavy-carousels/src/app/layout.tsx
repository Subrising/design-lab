import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wavy Infinite 3D Carousels",
  description:
    "React Three Fiber infinite scroll carousel with GLSL distortion shaders",
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
