import CevennoleContent from "@/components/stage/CevennoleContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stage Cévenol - Improvisation Musicale | In Extremis Formation",
  description:
    "Stage intensif d'improvisation musicale du 3 au 7 mars 2025 à Lasalle (Gard). 5 jours de création collective, techniques d'improvisation et performance finale. Tarif : 350-400€. Inscription ouverte.",
  keywords:
    "stage improvisation musicale, stage cévenol, stage musique gard, stage lasalle, stage mars 2025, improvisation collective, stage intensif improvisation, cours improvisation, formation musicale gard",
  openGraph: {
    title: "Stage Cévenol - Improvisation Musicale",
    description:
      "5 jours d'improvisation musicale intensive à Lasalle (Gard). Du 3 au 7 mars 2025. Création collective et performance finale.",
    url: "https://www.inextremisformation.fr/stage/cevennole",
    type: "website",
    images: [
      {
        url: "https://www.inextremisformation.fr/images/logo_white.png",
        width: 1200,
        height: 630,
        alt: "Stage Cévenol d'improvisation musicale",
      },
    ],
  },
};

const CevennoleStagePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationEvent",
            name: "Stage Cévenol - Improvisation Musicale",
            description:
              "Stage intensif d'improvisation musicale sur 5 jours avec techniques d'improvisation, travail en groupe et création collective",
            startDate: "2025-03-03",
            endDate: "2025-03-07",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "La Cure",
              address: {
                "@type": "PostalAddress",
                streetAddress: "15 rue henri mallol",
                addressLocality: "Lasalle",
                postalCode: "30460",
                addressCountry: "FR",
              },
            },
            organizer: {
              "@type": "EducationalOrganization",
              name: "In Extremis Formation",
              url: "https://www.inextremisformation.fr",
            },
            offers: [
              {
                "@type": "Offer",
                price: "400",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                description: "Tarif plein",
              },
              {
                "@type": "Offer",
                price: "350",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                description: "Tarif réduit adhérents",
              },
            ],
            performer: {
              "@type": "MusicGroup",
              name: "Équipe In Extremis Formation",
            },
          }),
        }}
      />
      <CevennoleContent />
    </>
  );
};

export default CevennoleStagePage;
