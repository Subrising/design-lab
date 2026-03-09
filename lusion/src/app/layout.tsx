import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUSION | Digital Experiences",
  description: "We create immersive digital experiences that push the boundaries of web technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
