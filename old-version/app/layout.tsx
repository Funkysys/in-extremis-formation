import Footer from "@/components/Footer";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.inextremisformation.vercel.app'),
  title: {
    default: "In Extremis Formation - Éducation musicale populaire en Ligne",
    template: "%s | In Extremis Formation"
  },
  icons: {
    icon: "/images/logo_white.png",
    shortcut: "/images/logo_white.png",
    apple: "/images/logo_white.png",
    other: [
      { rel: "mask-icon", url: "/images/logo_white.png", color: "#5bbad5" },
    ],
  },
  description: "In Extremis Formation propose des cours de musique en ligne personnalisés. Apprenez la musique à votre rythme avec des instructeurs professionnels. Cours de guitare, piano, batterie et plus encore.",
  keywords: "cours de musique en ligne, formation musicale, cours de guitare, cours de piano, cours de batterie, apprentissage musical, cours particuliers musique, formation musique en ligne, école de musique en ligne, cours de musique débutant, cours de musique avancé",
  authors: [{ name: "Antoine Delbos", url: "https://www.inextremisformation.vercel.app" }],
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "In Extremis Formation - Cours de Musique Personnalisés en Ligne",
    description: "Apprenez la musique à votre rythme avec des cours personnalisés. Découvrez nos formations en guitare, piano, batterie et plus encore.",
    siteName: "In Extremis Formation",
    url: "https://www.inextremisformation.vercel.app",
    images: [
      {
        url: "https://www.inextremisformation.com/images/logo_white.png",
        width: 1200,
        height: 630,
        alt: "In Extremis Formation - École de musique en ligne",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'In Extremis Formation - Éducation musicale populaire en Ligne',
    description: 'Apprenez la musique à votre rythme avec des cours personnalisés. Découvrez nos formations en ligne.',
    images: ['https://www.inextremisformation.vercel.app/images/logo_white.png'],
  },
  alternates: {
    canonical: 'https://www.inextremisformation.vercel.app',
  },
  verification: {
    google: 'ajoutez_votre_code_de_verification_google',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
