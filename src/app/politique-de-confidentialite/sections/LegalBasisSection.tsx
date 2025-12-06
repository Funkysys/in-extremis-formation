export function LegalBasisSection() {
  return (
    <section>
      <h2
        className="mb-4 text-2xl font-bold font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        4. Base légale du traitement
      </h2>
      <p>Les traitements de vos données sont fondés sur :</p>
      <ul className="mt-4 ml-4 space-y-2 list-disc list-inside">
        <li>
          <strong>Votre consentement</strong> pour les communications marketing
        </li>
        <li>
          <strong>L&apos;exécution du contrat</strong> pour la gestion de vos
          inscriptions
        </li>
        <li>
          <strong>Notre intérêt légitime</strong> pour l&apos;amélioration de
          nos services
        </li>
        <li>
          <strong>Nos obligations légales</strong> (comptabilité, fiscalité)
        </li>
      </ul>
    </section>
  );
}
