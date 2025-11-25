"use client";

import { Breadcrumb } from "@/components/stage/Breadcrumb";
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
            <div
              className="p-6 mt-10 rounded-lg"
              style={{
                background: "var(--color-background-secondary-stage)",
              }}
            >
              <h4
                className="mb-4 text-2xl font-bold"
                style={{ color: "var(--color-primary-stage)" }}
              >
                Les restitutions
              </h4>
              <strong style={{ color: "var(--color-foreground-stage)" }}>
                La Ballade + Jam:
              </strong>
              <br />
              restaurant associatif à Soudorgues
              <br />
              <br />
              <strong style={{ color: "var(--color-foreground-stage)" }}>
                La Filature:
              </strong>
              <br />
              <a
                href="https://www.lasalle.fr/lieux/filature-du-pont-de-fer"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--color-primary-stage)",
                  textDecoration: "underline",
                }}
              >
                site de la Filature
              </a>
            </div>

            <div
              className="p-6 mt-10 rounded-lg"
              style={{
                background: "var(--color-background-secondary-stage)",
              }}
            >
              <h4
                className="mb-4 text-2xl font-bold"
                style={{ color: "var(--color-primary-stage)" }}
              >
                Hébergement & Repas
              </h4>
              <p style={{ color: "var(--color-foreground-stage)" }}>
                <strong>Repas :</strong> Une proposition de repas végétarien est
                faite par le food truck {`"Judith"`} dans la salle associative
                pour un moment de convivialité entre étudiants et Intervenants.
                <br />
                - 12€ assiette repas + déssert
                <br />
                - 15€ entrée + plat + dessert
                <br />- possibilité {`d'apporter`} son propre repas
                <br />
                <strong>
                  Hébergement : des options d&apos;hébergement en gîte ou en
                  auberge sont disponibles à proximité.
                </strong>
                <br />
                Merci de nous contacter pour plus d&apos;informations.
              </p>
            </div>

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
                Les inscriptions sont ouvertes ! Ne tardez pas à réserver votre
                place pour ce stage unique en son genre.
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

              <div
                className="p-6 mt-8 rounded-lg"
                style={{
                  background: "var(--color-background-secondary-stage)",
                  borderLeft: "4px solid var(--color-primary-stage)",
                }}
              >
                <h3
                  className="mb-4 text-2xl font-bold font-montserrat"
                  style={{ color: "var(--color-primary-stage)" }}
                >
                  📞 Contact
                </h3>
                <div className="space-y-3">
                  <p
                    className="flex items-center gap-3 text-lg"
                    style={{ color: "var(--color-foreground-stage)" }}
                  >
                    <span className="text-2xl">📧</span>
                    <a
                      href="mailto:assoinextremis@gmail.com"
                      className="hover:underline"
                      style={{ color: "var(--color-primary-stage)" }}
                    >
                      assoinextremis@gmail.com
                    </a>
                  </p>
                  <p
                    className="flex items-center gap-3 text-lg"
                    style={{ color: "var(--color-foreground-stage)" }}
                  >
                    <span className="text-2xl">📱</span>
                    <a
                      href="tel:+33746271477"
                      className="hover:underline"
                      style={{ color: "var(--color-primary-stage)" }}
                    >
                      07 46 27 14 77
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
