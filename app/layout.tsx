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
  title: "In Extremis Formation - Apprendre la musique à son rythme",
  description:
    "Découvrez des cours de musique adaptés à votre niveau et vos envies. Progressez à votre rythme avec In Extremis Formation.",
  keywords:
    "musique, cours de musique, apprentissage, rythme, formation musicale",
  authors: [{ name: "Antoine Delbos" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "In Extremis Formation",
    description:
      "Apprendre la musique à son rythme avec des cours personnalisés.",
    siteName: "In Extremis Formation",
    url: "https://www.inextremisformation.com",
    images: [
      {
        url: "https://www.inextremisformation.com/images/logo_white.png",
        width: 1200,
        height: 630,
        alt: "In Extremis Formation - Apprendre la musique",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
