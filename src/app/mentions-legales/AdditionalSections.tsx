import Link from "next/link";

export function PersonalDataSection() {
  return (
    <section>
      <h2
        className="text-2xl font-bold mb-4 font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        5. Données personnelles
      </h2>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD),
        vous disposez d&apos;un droit d&apos;accès, de rectification et de
        suppression de vos données personnelles. Pour exercer ces droits,
        veuillez nous contacter à l&apos;adresse :{" "}
        <a
          href="mailto:assoinextremis@gmail.com"
          className="hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          assoinextremis@gmail.com
        </a>
      </p>
      <p className="mt-2">
        Pour plus d&apos;informations, consultez notre{" "}
        <Link
          href="/politique-de-confidentialite"
          className="hover:underline font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          Politique de confidentialité
        </Link>
        .
      </p>
    </section>
  );
}

export function CookiesSection() {
  return (
    <section>
      <h2
        className="text-2xl font-bold mb-4 font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        6. Cookies
      </h2>
      <p>
        Ce site utilise des cookies techniques nécessaires à son bon
        fonctionnement. Aucun cookie de tracking ou de publicité n&apos;est
        utilisé sans votre consentement.
      </p>
    </section>
  );
}

export function ResponsibilitySection() {
  return (
    <section>
      <h2
        className="text-2xl font-bold mb-4 font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        7. Responsabilité
      </h2>
      <p>
        L&apos;association In Extremis s&apos;efforce de maintenir les
        informations du site à jour et exactes. Toutefois, elle ne peut garantir
        l&apos;exactitude, la précision ou l&apos;exhaustivité des informations
        mises à disposition sur ce site.
      </p>
    </section>
  );
}

export function ApplicableLawSection() {
  return (
    <section>
      <h2
        className="text-2xl font-bold mb-4 font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        8. Loi applicable
      </h2>
      <p>
        Les présentes mentions légales sont régies par la loi française. En cas
        de litige, les tribunaux français seront seuls compétents.
      </p>
    </section>
  );
}
