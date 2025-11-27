"use client";

import { actus } from "@/data/actus";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const TYPE_COLORS = {
  stage: "bg-purple-500",
  cours: "bg-blue-500",
  event: "bg-green-500",
  news: "bg-orange-500",
} as const;
const TYPE_LABELS = {
  stage: "Stage",
  cours: "Cours",
  event: "Événement",
  news: "Actualité",
} as const;

const NavButton = ({
  onClick,
  direction,
  label,
}: {
  onClick: () => void;
  direction: "left" | "right";
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`hidden md:block absolute ${
      direction === "left" ? "left-4" : "right-4"
    } top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all hover:scale-110`}
    style={{
      background: "var(--color-background-secondary)",
      color: "var(--color-foreground)",
    }}
    aria-label={label}
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  </button>
);

export default function ActusCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % actus.length),
      5000
    );
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const navigate = (newIndex: number) => {
    setCurrentIndex(newIndex);
    setIsAutoPlaying(false);
  };

  return (
    <div className="w-[90vw] mx-auto">
      <h2
        className="mb-10 text-4xl font-bold text-center font-montserrat"
        style={{ color: "var(--color-foreground)" }}
      >
        📰 Actualités
      </h2>

      <div
        className="relative overflow-hidden rounded-xl shadow-2xl border-2 md:h-[80vh] flex flex-col"
        style={{
          background: "var(--color-background)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="flex flex-1 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {actus.map((actu) => (
            <div
              key={actu.id}
              className="flex flex-col flex-shrink-0 w-full h-full md:flex-row"
            >
              {actu.image && (
                <div className="flex-shrink-0 w-full md:w-1/2 h-1/2 md:h-full">
                  <Image
                    src={actu.image}
                    alt={actu.title}
                    className="object-cover w-full h-full"
                    width={500}
                    height={500}
                  />
                </div>
              )}

              <div className="p-4 md:p-16">
                <span
                  className={`inline-block px-3 py-1 text-xs md:text-sm font-semibold text-white rounded-full mb-3 md:mb-6 ${
                    TYPE_COLORS[actu.type]
                  }`}
                >
                  {TYPE_LABELS[actu.type]}
                </span>
                <h3
                  className="mb-3 text-2xl font-bold md:mb-6 md:text-5xl font-montserrat"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {actu.title}
                </h3>
                <p
                  className="flex items-center gap-2 mb-3 text-sm font-medium md:mb-8 md:text-lg"
                  style={{ color: "var(--color-foreground)", opacity: 0.8 }}
                >
                  <span className="text-lg md:text-2xl">📅</span>
                  {new Date(actu.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p
                  className="mb-auto text-sm leading-relaxed md:mb-10 md:text-xl"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {actu.description}
                </p>

                {actu.link && (
                  <Link
                    href={actu.link}
                    className="inline-block px-6 py-3 mt-4 text-base font-bold transition-all rounded-lg shadow-xl group md:px-10 md:py-5 md:text-xl hover:scale-105 w-fit md:mt-6"
                    style={{
                      background: "var(--color-button-hover-bg)",
                      color: "var(--color-primary-foreground)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--color-button-bg)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "var(--color-button-hover-bg)")
                    }
                  >
                    En savoir plus →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {actus.length > 1 && (
          <>
            <NavButton
              onClick={() =>
                navigate((currentIndex - 1 + actus.length) % actus.length)
              }
              direction="left"
              label="Actualité précédente"
            />
            <NavButton
              onClick={() => navigate((currentIndex + 1) % actus.length)}
              direction="right"
              label="Actualité suivante"
            />
            <div className="flex justify-center gap-2 py-4">
              {actus.map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigate(index)}
                  className="h-2 transition-all rounded-full"
                  style={{
                    width: index === currentIndex ? "2rem" : "0.5rem",
                    background:
                      index === currentIndex
                        ? "var(--color-primary)"
                        : "var(--color-muted)",
                  }}
                  aria-label={`Aller à l'actualité ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
