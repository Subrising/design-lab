import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Depth Gallery",
  description: "Z-axis depth gallery with palette-driven background and velocity distortion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
