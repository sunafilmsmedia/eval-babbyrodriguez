import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Instrument_Serif, Montserrat } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import Clarity from "@/components/Clarity";
import { BRAND } from "@/lib/brand";
import "./globals.css";

// Century Gothic n'est pas disponible sur Google Fonts (police commerciale) —
// Poppins est le substitut géométrique libre le plus proche.
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

// Gotham n'est pas disponible sur Google Fonts (police commerciale) —
// Montserrat est le substitut libre le plus utilisé pour Gotham.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: `${BRAND.teamName} — ¿Es el momento adecuado para vender?`,
  description: `Una evaluación personalizada, impulsada por inteligencia artificial, para saber si es un buen momento para vender su propiedad en ${BRAND.region}.`,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://exemple.vercel.app"),
  openGraph: {
    title: "¿Es el momento adecuado para vender su propiedad?",
    description: `Evaluación personalizada — ${BRAND.teamName}, RE/MAX, servicios inmobiliarios en ${BRAND.region}.`,
    locale: "es_LA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${poppins.variable} ${instrumentSerif.variable} ${montserrat.variable}`}>
      <body className="min-h-screen antialiased">
        <MetaPixel />
        <Clarity />
        {children}
        <Script
          src="https://clarity-scanner.vercel.app/tracker.js"
          data-project={process.env.NEXT_PUBLIC_CLARITY_SCANNER_PROJECT ?? BRAND.slug}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
