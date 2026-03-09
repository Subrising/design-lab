import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ASCII Dithering — WebGL Shader Tool",
  description:
    "Real-time ASCII art shader converting images and gradients to characters via WebGL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mono.variable} font-[family-name:var(--font-mono)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
