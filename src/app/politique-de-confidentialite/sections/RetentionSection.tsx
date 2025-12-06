export function RetentionSection() {
  return (
    <section>
      <h2
        className="mb-4 text-2xl font-bold font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        6. Durée de conservation
      </h2>
      <p className="mb-4">Vos données sont conservées pendant :</p>
      <ul className="ml-4 space-y-2 list-disc list-inside">
        <li>
          <strong>Comptes utilisateurs :</strong> jusqu&apos;à la suppression du
          compte ou 3 ans d&apos;inactivité
        </li>
        <li>
          <strong>Données d&apos;inscription :</strong> pendant la durée de la
          formation + 3 ans
        </li>
        <li>
          <strong>Données comptables :</strong> 10 ans (obligation légale)
        </li>
        <li>
          <strong>Logs de connexion :</strong> 12 mois maximum
        </li>
      </ul>
    </section>
  );
}
