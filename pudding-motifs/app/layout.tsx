import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Shape of Music — Musical Motifs Visualized",
  description:
    "An interactive scrollytelling exploration of musical motifs across classical composers, with real-time audio synthesis and animated notation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
