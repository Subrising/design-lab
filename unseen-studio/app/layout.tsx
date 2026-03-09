import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unseen Studio — Digital Design Studio",
  description: "Award-winning studio crafting bold digital identities and immersive web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0a0a] text-[#f5f0eb]">
        {children}
      </body>
    </html>
  );
}
