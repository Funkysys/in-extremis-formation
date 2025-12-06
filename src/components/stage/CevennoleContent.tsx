"use client";

import { Breadcrumb } from "@/components/stage/Breadcrumb";
import { StageHero } from "@/components/stage/StageHero";
import { StageModules } from "@/components/stage/StageModules";
import { useFadeOutScroll } from "@/hooks/useFadeOutScroll";
import { AccommodationSection } from "./CevennoleContent/AccommodationSection";
import { ContactSection } from "./CevennoleContent/ContactSection";
import { PracticalInfoSection } from "./CevennoleContent/PracticalInfoSection";
import { RegistrationSection } from "./CevennoleContent/RegistrationSection";
import { VenuesSection } from "./CevennoleContent/VenuesSection";

export default function CevennoleContent() {
  const fadeOut = useFadeOutScroll();

  return (
    <main
      className="overflow-x-hidden overflow-y-scroll"
      style={{ background: "var(--color-background-stage)" }}
    >
      <Breadcrumb />
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

        <PracticalInfoSection />

        <div className="max-w-4xl mx-auto w-full px-4">
          <VenuesSection />
          <AccommodationSection />
          <RegistrationSection />
          <ContactSection />
        </div>
      </div>
    </main>
  );
}
