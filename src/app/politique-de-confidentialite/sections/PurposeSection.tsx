export function PurposeSection() {
  return (
    <section>
      <h2
        className="mb-4 text-2xl font-bold font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        3. Finalité du traitement
      </h2>
      <p className="mb-4">
        Vos données personnelles sont collectées pour les finalités suivantes :
      </p>
      <ul className="ml-4 space-y-2 list-disc list-inside">
        <li>Gestion des inscriptions aux formations et stages</li>
        <li>Gestion de votre compte utilisateur</li>
        <li>
          Communication concernant nos activités (newsletters, événements)
        </li>
        <li>Amélioration de nos services</li>
        <li>Respect de nos obligations légales</li>
      </ul>
    </section>
  );
}
