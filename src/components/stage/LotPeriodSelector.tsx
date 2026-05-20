"use client";

import type { LotPeriod } from "./StageDetails";

interface LotPeriodSelectorProps {
  lotPeriod: LotPeriod;
  setLotPeriod: (period: LotPeriod) => void;
}

export function LotPeriodSelector({
  lotPeriod,
  setLotPeriod,
}: LotPeriodSelectorProps) {
  const periods: { id: LotPeriod; label: string; emoji: string }[] = [
    { id: "fevrier", label: "Février", emoji: "❄️" },
    { id: "juillet", label: "Juillet", emoji: "☀️" },
    { id: "aout", label: "Août", emoji: "🌾" },
  ];

  return (
    <div className="mb-8">
      <h4
        className="text-center text-lg font-semibold mb-4"
        style={{ color: "var(--color-foreground-stage)" }}
      >
        Choisissez votre période :
      </h4>
      <div className="flex flex-wrap justify-center gap-3">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => setLotPeriod(period.id)}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-300
              ${
                lotPeriod === period.id
                  ? "scale-105 shadow-lg"
                  : "opacity-70 hover:opacity-100"
              }
            `}
            style={{
              background:
                lotPeriod === period.id
                  ? "var(--color-primary-stage)"
                  : "var(--color-background-tertiary-stage)",
              color:
                lotPeriod === period.id
                  ? "white"
                  : "var(--color-foreground-stage)",
              border: `2px solid ${
                lotPeriod === period.id
                  ? "var(--color-primary-stage)"
                  : "var(--color-border-stage)"
              }`,
            }}
          >
            {period.emoji} {period.label}
          </button>
        ))}
      </div>
    </div>
  );
}
