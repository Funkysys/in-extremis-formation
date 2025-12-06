export function RecipientsSection() {
  return (
    <section>
      <h2
        className="mb-4 text-2xl font-bold font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        5. Destinataires des données
      </h2>
      <p className="mb-4">
        Vos données personnelles sont accessibles uniquement à :
      </p>
      <ul className="ml-4 space-y-2 list-disc list-inside">
        <li>Le personnel autorisé de l&apos;association In Extremis</li>
        <li>
          Nos prestataires techniques (hébergement, plateforme de paiement) sous
          contrat de confidentialité
        </li>
        <li>Les autorités légales si la loi l&apos;exige</li>
      </ul>
      <p className="mt-4">
        Nous ne vendons ni ne louons vos données personnelles à des tiers.
      </p>
    </section>
  );
}
