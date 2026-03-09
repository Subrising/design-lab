import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ponpon Mania — WebGL Interactive Comic",
  description:
    "An interactive comic experience with WebGL scene transitions, custom shaders, and smooth scrolling.",
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
