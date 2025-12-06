import { Metadata } from "next";
import Link from "next/link";
import {
  ApplicableLawSection,
  CookiesSection,
  PersonalDataSection,
  ResponsibilitySection,
} from "./AdditionalSections";
import {
  DirectorSection,
  EditorSection,
  HostingSection,
  IntellectualPropertySection,
} from "./LegalSections";

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
          <EditorSection />
          <DirectorSection />
          <HostingSection />
          <IntellectualPropertySection />
          <PersonalDataSection />
          <CookiesSection />
          <ResponsibilitySection />
          <ApplicableLawSection />
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
