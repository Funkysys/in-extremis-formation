"use client";
import modules from "@/data/modules";
// import Link from "next/link";
import { useState } from "react";

export function StageModules() {
  const [openModule, setOpenModule] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    setOpenModule(openModule === id ? null : id);
  };

  return (
    <div className="w-full px-4 py-32 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h3
          className="mb-8 text-4xl font-bold text-center font-montserrat"
          style={{ color: "var(--color-primary-stage)" }}
        >
          Programme des Modules
        </h3>
        <p
          className="mb-12 text-lg text-center"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          Découvrez en détail les différents modules qui composent notre stage
          d&apos;improvisation musicale
        </p>

        <div className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="overflow-hidden transition-all duration-300 rounded-lg"
              style={{
                background: "var(--color-background-tertiary-stage)",
                borderLeft: `4px solid ${
                  openModule === module.id
                    ? "var(--color-primary-stage)"
                    : "transparent"
                }`,
              }}
            >
              {/* Header - Bouton */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full px-6 py-4 text-left transition-colors hover:opacity-90"
                style={{
                  background:
                    openModule === module.id
                      ? "var(--color-primary-stage)"
                      : "var(--color-background-primary-stage)",
                  color:
                    openModule === module.id
                      ? "var(--color-secondary-stage)"
                      : "var(--color-foreground-stage)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{module.button}</span>
                  <span
                    className="text-2xl transition-transform duration-300"
                    style={{
                      transform:
                        openModule === module.id
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {/* Contenu déroulant */}
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openModule === module.id ? "1000px" : "0",
                }}
              >
                <div className="p-6">
                  <h4
                    className="mb-4 text-xl font-bold"
                    style={{ color: "var(--color-primary-stage)" }}
                  >
                    {module.title}
                  </h4>
                  <p
                    className="mb-4 leading-relaxed"
                    style={{ color: "var(--color-foreground-stage)" }}
                  >
                    {module.content}
                  </p>

                  {/* Liens pour le module "RÉPERTOIRE À PRÉPARER" */}
                  {/* {module.links && module.links.length > 0 && (
                    <div className="mt-6">
                      <h5
                        className="mb-4 text-lg font-semibold"
                        style={{ color: "var(--color-primary-stage)" }}
                      >
                        Morceaux à préparer :
                      </h5>
                      <div className="space-y-4">
                        {module.links.map((link, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg"
                            style={{
                              background:
                                "var(--color-background-secondary-stage)",
                            }}
                          >
                            <div className="mb-2">
                              <span
                                className="px-2 py-1 text-sm font-semibold rounded"
                                style={{
                                  background: "var(--color-primary-stage)",
                                  color: "#fff",
                                }}
                              >
                                {link.categorie}
                              </span>
                            </div>
                            <h6
                              className="mb-3 text-lg font-bold"
                              style={{ color: "var(--color-foreground-stage)" }}
                            >
                              {link.name}
                            </h6>
                            <div className="flex flex-wrap gap-3">
                              <Link
                                href={link.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 transition-all rounded hover:scale-105"
                                style={{
                                  background: "var(--color-primary-stage)",
                                  color: "#fff",
                                }}
                              >
                                🎵 Écouter sur YouTube
                              </Link>
                              <Link
                                href={link.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 transition-all rounded hover:scale-105"
                                style={{
                                  background: "var(--color-button-bg-stage)",
                                  color: "var(--color-button-text-stage)",
                                }}
                              >
                                📄 Télécharger la partition (PDF)
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
