"use client";

import { StageButton } from "./StageButton";

interface StageRegistrationProps {
  registration:
    | {
        description: string;
        form: string;
        parental: string;
        image: string;
      }
    | {
        description: string;
        form: string;
        image: string;
      }
    | {
        unavailable: true;
        message: string;
      }
    | {
        contact: true;
        message: string;
        email: string;
      };
}

export function StageRegistration({ registration }: StageRegistrationProps) {
  // Cas où les documents ne sont pas disponibles
  if ("unavailable" in registration && registration.unavailable) {
    return (
      <div
        className="p-8 text-center rounded-lg"
        style={{ background: "var(--color-background-tertiary-stage)" }}
      >
        <h4
          className="mb-4 text-2xl font-bold"
          style={{ color: "var(--color-primary-stage)" }}
        >
          📝 Inscription
        </h4>
        <p
          className="text-lg"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          {registration.message}
        </p>
      </div>
    );
  }

  // Cas où il faut contacter un organisme
  if ("contact" in registration && registration.contact) {
    return (
      <div
        className="p-8 text-center rounded-lg"
        style={{ background: "var(--color-background-tertiary-stage)" }}
      >
        <h4
          className="mb-4 text-2xl font-bold"
          style={{ color: "var(--color-primary-stage)" }}
        >
          📝 Inscription
        </h4>
        <p
          className="mb-4 text-lg"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          {registration.message}
        </p>
        <a
          href={`mailto:${registration.email}`}
          className="inline-block px-6 py-3 text-lg font-semibold transition-all duration-300 rounded-lg hover:scale-105"
          style={{
            background: "var(--color-primary-stage)",
            color: "white",
          }}
        >
          ✉️ {registration.email}
        </a>
      </div>
    );
  }

  // Cas standard avec les documents (si on arrive ici, on a forcément description, form, image)
  if (!("description" in registration)) {
    return null;
  }

  return (
    <div
      className="p-8 text-center rounded-lg"
      style={{ background: "var(--color-background-tertiary-stage)" }}
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
        pour ce stage unique.
      </p>

      <div className="flex flex-col gap-4">
        <StageButton href={registration.description}>
          📄 Document descriptif du stage (PDF)
        </StageButton>
        <StageButton href={registration.form}>
          ✍️ S&apos;inscrire au stage
        </StageButton>
        {"parental" in registration && (
          <StageButton href={registration.parental}>
            👨‍👩‍👧 Autorisation parentale
          </StageButton>
        )}
        <StageButton href={registration.image}>
          📸 {
            "parental" in registration 
              ? "Autorisation parentale + droit à l'image"
              : "Document de droit à l'image"
          }
        </StageButton>
      </div>
    </div>
  );
}
