import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reactive Depth Tube | 3D Image Gallery",
  description:
    "Scroll-driven 3D image tube gallery with depth-of-field and GLSL distortion.",
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
