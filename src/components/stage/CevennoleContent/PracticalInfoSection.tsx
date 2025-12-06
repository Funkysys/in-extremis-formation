import { StageInfoCard } from "@/components/stage/StageInfoCard";

export function PracticalInfoSection() {
  return (
    <section
      className="w-full px-4 py-16"
      style={{ background: "var(--color-background-tertiary-stage)" }}
    >
      <div className="max-w-4xl mx-auto">
        <h3
          className="mb-12 text-4xl font-bold text-center font-montserrat"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          Informations Pratiques
        </h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <StageInfoCard icon="📅" title="Dates & Horaires">
            <p>
              <strong>Du 3 au 7 mars 2025</strong>
              <br />
              Lundi au vendredi : 10h00 - 18h00
              <br />
              Pause déjeuner : 12h30 - 14h00
            </p>
          </StageInfoCard>

          <StageInfoCard icon="📍" title="Lieu">
            <p>
              <strong>Lasalle, Gard (30)</strong>
              <br />
              La Cure 15 rue henri mallol
              <br />
              30460 Lasalle
            </p>
          </StageInfoCard>

          <StageInfoCard icon="🎵" title="Programme">
            <ul>
              <li>• Techniques d&apos;improvisation</li>
              <li>• Travail en groupe</li>
              <li>• Création collective</li>
              <li>• Performance finale</li>
            </ul>
          </StageInfoCard>

          <StageInfoCard icon="💰" title="Tarifs">
            <p>
              <strong>Tarif plein :</strong> 380€
              <br />
              <strong>
                Tarif réduit (adhérents à {`l'association l'Art Scène`}) :
              </strong>{" "}
              350€
              <br />
              <em>Hébergement et repas non inclus</em>
            </p>
          </StageInfoCard>
        </div>
      </div>
    </section>
  );
}
