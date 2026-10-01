import type { Metadata } from "next";
import "./globals.css";
import "./editorial.css";
export const metadata: Metadata = {
  title: "IPL Analytics | The Game in Numbers",
  description:
    "Explore Indian Premier League matches, teams, players, and seasons from 2008 to 2024.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
