import { Metadata } from "next";
import Link from "next/link";
import { CookiesSection } from "./sections/CookiesSection";
import { DataCollectionSection } from "./sections/DataCollectionSection";
import { IntroSection } from "./sections/IntroSection";
import { LegalBasisSection } from "./sections/LegalBasisSection";
import { ModificationsSection } from "./sections/ModificationsSection";
import { PurposeSection } from "./sections/PurposeSection";
import { RecipientsSection } from "./sections/RecipientsSection";
import { ResponsibleSection } from "./sections/ResponsibleSection";
import { RetentionSection } from "./sections/RetentionSection";
import { RightsSection } from "./sections/RightsSection";
import { SecuritySection } from "./sections/SecuritySection";

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
          <IntroSection />
          <ResponsibleSection />
          <DataCollectionSection />
          <PurposeSection />
          <LegalBasisSection />
          <RecipientsSection />
          <RetentionSection />
          <RightsSection />
          <SecuritySection />
          <CookiesSection />
          <ModificationsSection />
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
