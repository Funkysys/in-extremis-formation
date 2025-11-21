"use client";

import { StageButton } from "@/components/stage/StageButton";
import { StageHero } from "@/components/stage/StageHero";
import { StageInfoCard } from "@/components/stage/StageInfoCard";
import { StageModules } from "@/components/stage/StageModules";
import { useFadeOutScroll } from "@/hooks/useFadeOutScroll";

export default function CevennoleContent() {
  const fadeOut = useFadeOutScroll();

  return (
    <main
      className="overflow-x-hidden overflow-y-scroll"
      style={{ background: "var(--color-background-stage)" }}
    >
      <StageHero
        title="STAGE CÉVENOL"
        subtitle="Improvisation Musicale"
        date="Du 3 au 7 mars 2025"
        place="Lasalle, Gard"
      />

      <div
        className="w-[100vw] md:min-h-[100vh] pt-10 md:px-10 flex flex-col justify-center items-center transition-opacity duration-500 sticky top-0"
        style={{
          opacity: 1 - fadeOut,
          background: "var(--color-background-secondary-stage)",
        }}
      >
        <section className="mb-32">
          <StageModules />
        </section>

        <section className="grid w-full max-w-5xl grid-cols-1 gap-8 px-4 mb-16 md:grid-cols-2">
          <StageInfoCard icon="📅" title="Dates">
            Du 3 au 7 mars 2025
          </StageInfoCard>
          <StageInfoCard icon="📍" title="Lieu">
            Lasalle, Gard (30)
          </StageInfoCard>
          <StageInfoCard icon="💰" title="Tarifs">
            350€ (adhérents) / 400€ (plein)
          </StageInfoCard>
          <StageInfoCard icon="🎵" title="Niveau">
            Tous niveaux
          </StageInfoCard>
        </section>

        <section className="flex flex-wrap justify-center gap-6 px-4 mb-32">
          <StageButton href="/images/description_cev_2026.pdf">
            📄 Description complète
          </StageButton>
          <StageButton href="/images/formulaire_inscription_cev26.pdf">
            ✍️ Formulaire d&apos;inscription
          </StageButton>
          <StageButton href="/images/autorisation_image_cev_2026.pdf">
            📸 Autorisation image
          </StageButton>
        </section>
      </div>
    </main>
  );
}
