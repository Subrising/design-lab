import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "50 Years Swiss Music Charts — Data Visualization",
  description:
    "An interactive WebGL data visualization exploring 50 years of Swiss music chart history from 1974 to 2024.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
