import type { Metadata } from "next";
import { Hanken_Grotesk, Geist_Mono, Shippori_Antique } from "next/font/google";
import "./globals.css";
import "@/components/ui/aethel-ui.css";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aethellabs.com";
const DESCRIPTION =
  "A digital studio for brand identity, websites, and the content that keeps them alive. Design and build, under one roof. Design worth the name.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aethel Labs — Brand & Web Studio",
    template: "%s — Aethel Labs",
  },
  description: DESCRIPTION,
  applicationName: "Aethel Labs",
  keywords: [
    "brand identity", "web design", "landing pages", "design studio",
    "brand and build", "content subscription", "Aethel Labs",
  ],
  authors: [{ name: "Aethel Labs" }],
  creator: "Aethel Labs",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Aethel Labs",
    title: "Aethel Labs — Brand & Web Studio",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aethel Labs — Brand & Web Studio",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/brand/mark-gradient.svg", type: "image/svg+xml" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Aethel Labs",
  description: DESCRIPTION,
  url: SITE_URL,
  email: "joshuasabuero.main@gmail.com",
  slogan: "Design worth the name.",
  areaServed: "Worldwide",
  knowsAbout: ["Brand Identity", "Web Design", "Landing Pages", "Content Strategy"],
  makesOffer: [
    { "@type": "Offer", name: "Brand Identity" },
    { "@type": "Offer", name: "Websites & Landing Pages" },
    { "@type": "Offer", name: "The Content Engine" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
