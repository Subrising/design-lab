import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Griflan — Creative Digital Studio",
  description: "A creative studio focused on brand strategy, digital design, and development for forward-thinking companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
