import HomeClient from "@/components/vitrineUi/HomeClient";
import { cards } from "@/data/cards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil - Éducation musicale populaire en ligne",
  description:
    "In Extremis Formation : plateforme d'éducation musicale populaire en ligne. Cours de musique personnalisés, stages intensifs, et formations pour tous niveaux. Apprenez la guitare, le piano, le chant et plus encore.",
  keywords:
    "cours musique en ligne, formation musicale, stage musique, école musique en ligne, cours guitare, cours piano, cours chant, éducation musicale populaire, cours particuliers musique",
  openGraph: {
    title: "In Extremis Formation - Éducation musicale populaire",
    description:
      "Plateforme de cours de musique en ligne et stages intensifs. Formations personnalisées pour tous niveaux.",
    url: "https://www.inextremisformation.fr",
    type: "website",
    images: [
      {
        url: "https://www.inextremisformation.fr/images/logo_white.png",
        width: 1200,
        height: 630,
        alt: "In Extremis Formation - École de musique en ligne",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "In Extremis Formation",
            description:
              "Plateforme d'éducation musicale populaire proposant des cours en ligne et des stages intensifs",
            url: "https://www.inextremisformation.fr",
            logo: "https://www.inextremisformation.fr/images/logo_white.png",
            sameAs: [
              "https://www.facebook.com/inextremisformation",
              "https://www.instagram.com/inextremisformation",
            ],
            address: {
              "@type": "PostalAddress",
              addressCountry: "FR",
            },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "EUR",
              description: "Cours de musique en ligne et stages intensifs",
            },
          }),
        }}
      />
      <HomeClient cards={cards} />
    </>
  );
}
