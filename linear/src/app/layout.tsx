import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linear — Plan, build, and ship product",
  description: "Linear replica — dark gradient mesh hero, animated feature cards, frosted glass UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
