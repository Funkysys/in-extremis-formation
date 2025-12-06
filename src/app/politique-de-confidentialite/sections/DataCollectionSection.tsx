export function DataCollectionSection() {
  return (
    <section>
      <h2
        className="mb-4 text-2xl font-bold font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        2. Données personnelles collectées
      </h2>
      <p className="mb-4">
        Nous collectons les données personnelles suivantes :
      </p>
      <ul className="ml-4 space-y-2 list-disc list-inside">
        <li>
          <strong>Lors de l&apos;inscription aux formations :</strong> nom,
          prénom, adresse email, numéro de téléphone, adresse postale
        </li>
        <li>
          <strong>Lors de la création d&apos;un compte :</strong> nom, prénom,
          adresse email, mot de passe (chiffré)
        </li>
        <li>
          <strong>Données de navigation :</strong> adresse IP, type de
          navigateur, pages visitées, date et heure de visite (via les logs
          serveur)
        </li>
      </ul>
    </section>
  );
}
