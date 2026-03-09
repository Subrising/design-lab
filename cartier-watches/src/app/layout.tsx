import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cartier — Watches & Wonders",
  description: "A luxury watch showcase experience",
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
