import type { Metadata } from "next";
import { Hanken_Grotesk, Geist_Mono, Shippori_Antique } from "next/font/google";
import "./globals.css";

// Body / UI — modern grotesque (variable, 300–800).
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
// Eyebrows / labels / prices — the "Labs" technical edge (variable).
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
// Display / headings — noble antique-gothic; single weight (400). Hierarchy is by size.
const shippori = Shippori_Antique({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-shippori",
  display: "swap",
});

const fontVars = `${hanken.variable} ${geistMono.variable} ${shippori.variable}`;

export const metadata: Metadata = {
  title: "Aethel Labs — Brand & Web Studio",
  description: "A digital studio for brand identity, websites, and the content that keeps them alive. Design worth the name.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
