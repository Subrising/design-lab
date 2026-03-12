import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gommage Effect — Text Dissolution",
  description:
    "MSDF text dissolution into dust and petals with particle physics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
