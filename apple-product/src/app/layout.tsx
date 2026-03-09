import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iPhone 16 Pro — Apple",
  description: "iPhone 16 Pro. Built for Apple Intelligence. Featuring A18 Pro chip, 48MP camera system, and titanium design.",
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
