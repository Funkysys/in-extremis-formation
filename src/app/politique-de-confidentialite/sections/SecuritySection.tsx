export function SecuritySection() {
  return (
    <section>
      <h2
        className="mb-4 text-2xl font-bold font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        8. Sécurité des données
      </h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles
        appropriées pour protéger vos données personnelles contre tout accès non
        autorisé, perte, destruction ou altération. Ces mesures incluent :
      </p>
      <ul className="mt-4 ml-4 space-y-2 list-disc list-inside">
        <li>Chiffrement des mots de passe</li>
        <li>Connexions sécurisées (HTTPS)</li>
        <li>Hébergement sur des serveurs sécurisés</li>
        <li>Accès limité aux données par le personnel autorisé</li>
        <li>Sauvegardes régulières</li>
      </ul>
    </section>
  );
}
