import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - In Extremis Formation",
  description:
    "Politique de protection des données personnelles d'In Extremis Formation",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main
      className="min-h-screen px-4 py-16"
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
          className="mb-8 text-4xl font-bold font-montserrat"
          style={{ color: "var(--color-foreground)" }}
        >
          Politique de Confidentialité
        </h1>

        <div
          className="space-y-8 text-base leading-relaxed"
          style={{ color: "var(--color-foreground)" }}
        >
          {/* Introduction */}
          <section>
            <p>
              L&apos;association In Extremis accorde une grande importance à la
              protection de vos données personnelles. Cette politique de
              confidentialité décrit comment nous collectons, utilisons et
              protégeons vos informations personnelles conformément au Règlement
              Général sur la Protection des Données (RGPD).
            </p>
          </section>

          {/* Responsable du traitement */}
          <section>
            <h2
              className="mb-4 text-2xl font-bold font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              1. Responsable du traitement des données
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Association :</strong> In Extremis
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
                <strong>Contact DPO :</strong> Antoine Delbos -{" "}
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

          {/* Données collectées */}
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
                <strong>Lors de l&apos;inscription aux formations :</strong>{" "}
                nom, prénom, adresse email, numéro de téléphone, adresse postale
              </li>
              <li>
                <strong>Lors de la création d&apos;un compte :</strong> nom,
                prénom, adresse email, mot de passe (chiffré)
              </li>
              <li>
                <strong>Données de navigation :</strong> adresse IP, type de
                navigateur, pages visitées, date et heure de visite (via les
                logs serveur)
              </li>
            </ul>
          </section>

          {/* Finalité du traitement */}
          <section>
            <h2
              className="mb-4 text-2xl font-bold font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              3. Finalité du traitement
            </h2>
            <p className="mb-4">
              Vos données personnelles sont collectées pour les finalités
              suivantes :
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

          {/* Base légale */}
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
                <strong>Votre consentement</strong> pour les communications
                marketing
              </li>
              <li>
                <strong>L&apos;exécution du contrat</strong> pour la gestion de
                vos inscriptions
              </li>
              <li>
                <strong>Notre intérêt légitime</strong> pour l&apos;amélioration
                de nos services
              </li>
              <li>
                <strong>Nos obligations légales</strong> (comptabilité,
                fiscalité)
              </li>
            </ul>
          </section>

          {/* Destinataires */}
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
                Nos prestataires techniques (hébergement, plateforme de
                paiement) sous contrat de confidentialité
              </li>
              <li>Les autorités légales si la loi l&apos;exige</li>
            </ul>
            <p className="mt-4">
              Nous ne vendons ni ne louons vos données personnelles à des tiers.
            </p>
          </section>

          {/* Durée de conservation */}
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
                <strong>Comptes utilisateurs :</strong> jusqu&apos;à la
                suppression du compte ou 3 ans d&apos;inactivité
              </li>
              <li>
                <strong>Données d&apos;inscription :</strong> pendant la durée
                de la formation + 3 ans
              </li>
              <li>
                <strong>Données comptables :</strong> 10 ans (obligation légale)
              </li>
              <li>
                <strong>Logs de connexion :</strong> 12 mois maximum
              </li>
            </ul>
          </section>

          {/* Droits des utilisateurs */}
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
                <strong>Droit d&apos;accès :</strong> obtenir une copie de vos
                données
              </li>
              <li>
                <strong>Droit de rectification :</strong> corriger vos données
                inexactes
              </li>
              <li>
                <strong>Droit à l&apos;effacement :</strong> supprimer vos
                données (sous conditions)
              </li>
              <li>
                <strong>Droit à la limitation :</strong> limiter le traitement
                de vos données
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> recevoir vos données
                dans un format structuré
              </li>
              <li>
                <strong>Droit d&apos;opposition :</strong> vous opposer au
                traitement de vos données
              </li>
              <li>
                <strong>Droit de retirer votre consentement :</strong> à tout
                moment pour les traitements basés sur le consentement
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
              auprès de la CNIL (Commission Nationale de l&apos;Informatique et
              des Libertés) :{" "}
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

          {/* Sécurité */}
          <section>
            <h2
              className="mb-4 text-2xl font-bold font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              8. Sécurité des données
            </h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données personnelles contre tout
              accès non autorisé, perte, destruction ou altération. Ces mesures
              incluent :
            </p>
            <ul className="mt-4 ml-4 space-y-2 list-disc list-inside">
              <li>Chiffrement des mots de passe</li>
              <li>Connexions sécurisées (HTTPS)</li>
              <li>Hébergement sur des serveurs sécurisés</li>
              <li>Accès limité aux données par le personnel autorisé</li>
              <li>Sauvegardes régulières</li>
            </ul>
          </section>

          {/* Cookies */}
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
                <strong>Cookies techniques :</strong> nécessaires au
                fonctionnement du site (authentification, préférences)
              </li>
              <li>
                <strong>Cookies analytiques :</strong> avec votre consentement,
                pour analyser l&apos;utilisation du site
              </li>
            </ul>
            <p className="mt-4">
              Vous pouvez gérer vos préférences cookies dans les paramètres de
              votre navigateur.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2
              className="mb-4 text-2xl font-bold font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              10. Modifications de la politique
            </h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment. Toute modification sera publiée sur
              cette page avec une nouvelle date de mise à jour. Nous vous
              encourageons à consulter régulièrement cette page.
            </p>
          </section>
        </div>

        <div
          className="pt-8 mt-12 border-t"
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
