import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raycast — Your shortcut to everything",
  description:
    "A collection of powerful productivity tools all within an extendable launcher.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
