import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dennis Snellenberg — Creative Developer",
  description: "Freelance designer & developer focused on creating interactive digital experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
