import Footer from "@/components/Footer";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Loading from "./loading";
import CustomApolloProvider from "@/providers/ApolloProvider";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.inextremisformation.vercel.app"),
  title: {
    default: "In Extremis Formation - Éducation musicale populaire en Ligne",
    template: "%s | In Extremis Formation",
  },
  icons: {
    icon: "/images/logo_white.png",
    shortcut: "/images/logo_white.png",
    apple: "/images/logo_white.png",
    other: [
      { rel: "mask-icon", url: "/images/logo_white.png", color: "#5bbad5" },
    ],
  },
  description:
    "In Extremis Formation propose des cours de musique en ligne personnalisés. Apprenez la musique à votre rythme avec des instructeurs professionnels. Cours de guitare, piano, batterie et plus encore.",
  keywords:
    "cours de musique en ligne, formation musicale, cours de guitare, cours de piano, cours de batterie, apprentissage musical, cours particuliers musique, formation musique en ligne, école de musique en ligne, cours de musique débutant, cours de musique avancé",
  authors: [
    {
      name: "Antoine Delbos",
      url: "https://www.inextremisformation.vercel.app",
    },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "In Extremis Formation - Cours de Musique Personnalisés en Ligne",
    description:
      "Apprenez la musique à votre rythme avec des cours personnalisés. Découvrez nos formations en guitare, piano, batterie et plus encore.",
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
    card: "summary_large_image",
    title: "In Extremis Formation - Éducation musicale populaire en Ligne",
    description:
      "Apprenez la musique à votre rythme avec des cours personnalisés. Découvrez nos formations en ligne.",
    images: [
      "https://www.inextremisformation.vercel.app/images/logo_white.png",
    ],
  },
  alternates: {
    canonical: "https://www.inextremisformation.vercel.app",
  },
  verification: {
    google: "ajoutez_votre_code_de_verification_google",
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
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased `}
      >
        <CustomApolloProvider>
          <Suspense fallback={<Loading />}>

            {children}
            <Footer />
          </Suspense>
        </CustomApolloProvider>
      </body>
    </html>
  );
}
