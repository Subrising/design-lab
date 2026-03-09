import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stripe — Financial Infrastructure for the Internet",
  description: "Stripe replica showcasing gradient mesh, morphing nav, and scroll storytelling",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
