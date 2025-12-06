import { StageButton } from "@/components/stage/StageButton";

export function RegistrationSection() {
  return (
    <div
      className="p-8 mt-12 text-center rounded-lg"
      style={{ background: "var(--color-background-secondary-stage)" }}
    >
      <h4
        className="mb-4 text-2xl font-bold"
        style={{ color: "var(--color-primary-stage)" }}
      >
        📝 Inscription
      </h4>
      <p
        className="mb-6 text-lg"
        style={{ color: "var(--color-foreground-stage)" }}
      >
        Les inscriptions sont ouvertes ! Ne tardez pas à réserver votre place
        pour ce stage unique en son genre.
      </p>

      <div className="flex flex-col gap-4">
        <StageButton href="/images/description_cev_2026.pdf">
          📄 Document descriptif du stage (PDF)
        </StageButton>
        <StageButton href="/images/formulaire_inscription_cev26.pdf">
          ✍️ S&apos;inscrire au stage
        </StageButton>
        <StageButton href="/images/autorisation_image_cev_2026.pdf">
          📸 Document de droit à l&apos;image
        </StageButton>
      </div>
    </div>
  );
}
