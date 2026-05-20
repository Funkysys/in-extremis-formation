"use client";

import { stagesDetailsData } from "@/data/stages";
import { useState } from "react";
import { LotPeriodSelector } from "./LotPeriodSelector";
import { StageContact } from "./StageContact";
import { StageHeader } from "./StageHeader";
import { StageImage } from "./StageImage";
import { StageInfoCard } from "./StageInfoCard";
import { StageModules } from "./StageModules";
import { StageRegistration } from "./StageRegistration";
import type { StageType } from "./StageSelector";

interface StageDetailsProps {
  stage: StageType;
}

export type LotPeriod = "fevrier" | "juillet" | "aout";

export function StageDetails({ stage }: StageDetailsProps) {
  // Utiliser une valeur par défaut constante pour éviter les problèmes d'hydratation
  const [lotPeriod, setLotPeriod] = useState<LotPeriod>("juillet");

  // Pour le stage du Lot, on récupère les données selon la période
  const data =
    stage === "lot"
      ? stagesDetailsData.lot[lotPeriod]
      : stagesDetailsData[stage];

  return (
    <div
      className="p-8 rounded-lg animate-fade-in"
      style={{ background: "var(--color-background-secondary-stage)" }}
    >
      <StageImage src={data.image} alt={`Image du ${data.title}`} />

      {stage === "lot" && (
        <LotPeriodSelector lotPeriod={lotPeriod} setLotPeriod={setLotPeriod} />
      )}

      <StageHeader
        title={data.title}
        subtitle={data.subtitle}
        description={data.description}
      />

      <div className="mb-16">
        <StageModules />
      </div>

      {/* Informations pratiques */}
      <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
        <StageInfoCard icon="📅" title="Dates & Horaires">
          <p>
            <strong>{data.dates}</strong>
            <br />
            {data.schedule}
          </p>
        </StageInfoCard>

        <StageInfoCard icon="📍" title="Lieu">
          <p>
            <strong>{data.location}</strong>
            <br />
            {data.locationDetails}
          </p>
        </StageInfoCard>

        <StageInfoCard icon="🎵" title="Programme">
          <ul>
            {data.program.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </StageInfoCard>

        <StageInfoCard icon="💰" title="Tarifs">
          <p>
            <strong>Tarif plein :</strong> {data.prices.full}
            <br />
            {"reduced" in data.prices &&
              data.prices.reduced &&
              "reducedInfo" in data && (
                <>
                  <strong>Tarif réduit ({data.reducedInfo}) :</strong>{" "}
                  {data.prices.reduced}
                  <br />
                </>
              )}
            {"minor" in data.prices &&
              data.prices.minor &&
              "minorInfo" in data &&
              data.minorInfo && (
                <>
                  <strong>Tarif minoré ({data.minorInfo}) :</strong>{" "}
                  {data.prices.minor}
                </>
              )}
          </p>
        </StageInfoCard>
      </div>

      {/* Hébergement & Repas */}
      <div
        className="p-8 mb-10 rounded-lg"
        style={{ background: "var(--color-background-tertiary-stage)" }}
      >
        <h4
          className="mb-4 text-2xl font-bold"
          style={{ color: "var(--color-primary-stage)" }}
        >
          🏠 Hébergement & Repas
        </h4>
        <div
          className="space-y-3 whitespace-pre-line"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          <p>
            <strong>Hébergement :</strong> {data.accommodation}
          </p>
          <p>
            <strong>Repas :</strong> {data.meals}
          </p>
        </div>
      </div>

      {/* Venues (si disponible) */}
      {data.venues && (
        <div
          className="p-8 mb-10 rounded-lg"
          style={{ background: "var(--color-background-tertiary-stage)" }}
        >
          <h4
            className="mb-4 text-2xl font-bold"
            style={{ color: "var(--color-primary-stage)" }}
          >
            🎭 Les restitutions
          </h4>
          <div
            className="space-y-2 whitespace-pre-line"
            style={{ color: "var(--color-foreground-stage)" }}
            dangerouslySetInnerHTML={{ __html: data.venues }}
          />
        </div>
      )}

      <StageRegistration registration={data.registration} />
      <StageContact />
    </div>
  );
}
