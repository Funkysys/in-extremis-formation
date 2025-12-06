export function CookiesSection() {
  return (
    <section>
      <h2
        className="mb-4 text-2xl font-bold font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        9. Cookies
      </h2>
      <p className="mb-4">Notre site utilise les cookies suivants :</p>
      <ul className="ml-4 space-y-2 list-disc list-inside">
        <li>
          <strong>Cookies techniques :</strong> nécessaires au fonctionnement du
          site (authentification, préférences)
        </li>
        <li>
          <strong>Cookies analytiques :</strong> avec votre consentement, pour
          analyser l&apos;utilisation du site
        </li>
      </ul>
      <p className="mt-4">
        Vous pouvez gérer vos préférences cookies dans les paramètres de votre
        navigateur.
      </p>
    </section>
  );
}
