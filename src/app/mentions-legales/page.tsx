import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions Légales - In Extremis Formation",
  description: "Mentions légales du site In Extremis Formation",
};

export default function MentionsLegalesPage() {
  return (
    <main
      className="min-h-screen py-16 px-4"
      style={{ background: "var(--color-background)" }}
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          ← Retour à l&apos;accueil
        </Link>

        <h1
          className="text-4xl font-bold mb-8 font-montserrat"
          style={{ color: "var(--color-foreground)" }}
        >
          Mentions Légales
        </h1>

        <div
          className="space-y-8 text-base leading-relaxed"
          style={{ color: "var(--color-foreground)" }}
        >
          {/* Éditeur du site */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              1. Éditeur du site
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Nom de l&apos;association :</strong> In Extremis
              </p>
              <p>
                <strong>Adresse :</strong> 11 rue de la Cascade, 46160 Cajarc,
                France
              </p>
              <p>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:assoinextremis@gmail.com"
                  className="hover:underline"
                  style={{ color: "var(--color-primary)" }}
                >
                  assoinextremis@gmail.com
                </a>
              </p>
              <p>
                <strong>Téléphone :</strong>{" "}
                <a
                  href="tel:+33746271477"
                  className="hover:underline"
                  style={{ color: "var(--color-primary)" }}
                >
                  07 46 27 14 77
                </a>
              </p>
            </div>
          </section>

          {/* Directeur de la publication */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              2. Directeur de la publication
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Nom :</strong> Antoine Delbos
              </p>
              <p>
                <strong>Adresse :</strong> 2 rue Lancefoc, Toulouse, France
              </p>
              <p>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:antoine.delbos.developpement@gmail.com"
                  className="hover:underline"
                  style={{ color: "var(--color-primary)" }}
                >
                  antoine.delbos.developpement@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              3. Hébergement
            </h2>
            <p>
              Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133,
              Walnut, CA 91789, USA.
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              4. Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, vidéos,
              logos, etc.) est la propriété exclusive de l&apos;association In
              Extremis, sauf mention contraire. Toute reproduction, distribution
              ou utilisation sans autorisation préalable est interdite.
            </p>
          </section>

          {/* Données personnelles */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              5. Données personnelles
            </h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données
              (RGPD), vous disposez d&apos;un droit d&apos;accès, de
              rectification et de suppression de vos données personnelles. Pour
              exercer ces droits, veuillez nous contacter à l&apos;adresse :{" "}
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

          {/* Cookies */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              6. Cookies
            </h2>
            <p>
              Ce site utilise des cookies techniques nécessaires à son bon
              fonctionnement. Aucun cookie de tracking ou de publicité
              n&apos;est utilisé sans votre consentement.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              7. Responsabilité
            </h2>
            <p>
              L&apos;association In Extremis s&apos;efforce de maintenir les
              informations du site à jour et exactes. Toutefois, elle ne peut
              garantir l&apos;exactitude, la précision ou l&apos;exhaustivité
              des informations mises à disposition sur ce site.
            </p>
          </section>

          {/* Loi applicable */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              8. Loi applicable
            </h2>
            <p>
              Les présentes mentions légales sont régies par la loi française.
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>
        </div>

        <div
          className="mt-12 pt-8 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="text-sm text-center"
            style={{ color: "var(--color-foreground)", opacity: 0.6 }}
          >
            Dernière mise à jour : 25 novembre 2025
          </p>
        </div>
      </div>
    </main>
  );
}
