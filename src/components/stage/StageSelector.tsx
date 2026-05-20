"use client";

import { useState } from "react";
import { StageDetails } from "./StageDetails";

export type StageType = "lot" | "cevennes" | "bretagne";

const stages = [
  {
    id: "lot" as StageType,
    name: "Stage du Lot",
    emoji: "🏔️",
  },
  {
    id: "cevennes" as StageType,
    name: "Stage Cévenol",
    emoji: "🌲",
  },
  {
    id: "bretagne" as StageType,
    name: "Stage Breton",
    emoji: "🌊",
  },
];

export function StageSelector() {
  const [selectedStage, setSelectedStage] = useState<StageType>("lot");

  return (
    <section
      className="w-full px-4 py-16 md:px-10"
      style={{ background: "var(--color-background-stage)" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="mb-12 text-4xl font-bold text-center font-montserrat"
          style={{ color: "var(--color-primary-stage)" }}
        >
          Nos Différents Stages
        </h2>

        {/* Sélecteur de stages élégant */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`
                px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300
                transform hover:scale-105 hover:shadow-lg
                ${
                  selectedStage === stage.id
                    ? "scale-105 shadow-xl"
                    : "opacity-70 hover:opacity-100"
                }
              `}
              style={{
                background:
                  selectedStage === stage.id
                    ? "var(--color-primary-stage)"
                    : "var(--color-background-secondary-stage)",
                color:
                  selectedStage === stage.id
                    ? "white"
                    : "var(--color-foreground-stage)",
                border: `2px solid ${
                  selectedStage === stage.id
                    ? "var(--color-primary-stage)"
                    : "var(--color-border-stage)"
                }`,
              }}
            >
              <span className="mr-2">{stage.emoji}</span>
              {stage.name}
            </button>
          ))}
        </div>

        {/* Détails du stage sélectionné avec animation */}
        <div
          className="transition-all duration-500 ease-in-out"
          key={selectedStage}
        >
          <StageDetails stage={selectedStage} />
        </div>
      </div>
    </section>
  );
}
