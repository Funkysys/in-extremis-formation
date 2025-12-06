export function RightsSection() {
  return (
    <section>
      <h2
        className="mb-4 text-2xl font-bold font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        7. Vos droits
      </h2>
      <p className="mb-4">
        Conformément au RGPD, vous disposez des droits suivants :
      </p>
      <ul className="ml-4 space-y-2 list-disc list-inside">
        <li>
          <strong>Droit d&apos;accès :</strong> obtenir une copie de vos données
        </li>
        <li>
          <strong>Droit de rectification :</strong> corriger vos données
          inexactes
        </li>
        <li>
          <strong>Droit à l&apos;effacement :</strong> supprimer vos données
          (sous conditions)
        </li>
        <li>
          <strong>Droit à la limitation :</strong> limiter le traitement de vos
          données
        </li>
        <li>
          <strong>Droit à la portabilité :</strong> recevoir vos données dans un
          format structuré
        </li>
        <li>
          <strong>Droit d&apos;opposition :</strong> vous opposer au traitement
          de vos données
        </li>
        <li>
          <strong>Droit de retirer votre consentement :</strong> à tout moment
          pour les traitements basés sur le consentement
        </li>
      </ul>
      <p className="mt-4">
        Pour exercer ces droits, contactez-nous à :{" "}
        <a
          href="mailto:assoinextremis@gmail.com"
          className="font-semibold hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          assoinextremis@gmail.com
        </a>
      </p>
      <p className="mt-2">
        Vous disposez également du droit d&apos;introduire une réclamation
        auprès de la CNIL (Commission Nationale de l&apos;Informatique et des
        Libertés) :{" "}
        <a
          href="https://www.cnil.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          www.cnil.fr
        </a>
      </p>
    </section>
  );
}
