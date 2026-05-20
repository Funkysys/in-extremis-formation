import { redirect } from "next/navigation";

export default function CevennoleStagePage() {
  redirect("/stage");
}
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
                price: "380",
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
