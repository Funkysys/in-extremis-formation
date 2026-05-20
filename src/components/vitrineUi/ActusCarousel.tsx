"use client";

import { actus } from "@/data/actus";
import { useState, useEffect } from "react";
import Image from "next/image";

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

export default function ActusCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % actus.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + actus.length) % actus.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % actus.length);
  };

  return (
    <div className="w-[90vw] mx-auto py-10">
      <h2
        className="mb-10 text-4xl font-bold text-center font-montserrat"
        style={{ color: "var(--color-foreground)" }}
      >
        📰 Actualités
      </h2>

      <div
        className="relative overflow-hidden rounded-xl shadow-2xl border-2"
        style={{
          background: "var(--color-background)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Carrousel */}
        <div className="relative w-full h-[500px] md:h-[600px]">
          {actus.map((actu, index) => (
            <div
              key={actu.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex flex-col h-full md:flex-row">
                {/* Image */}
                {actu.image && (
                  <div className="relative w-full h-48 md:w-1/2 md:h-full">
                    <Image
                      src={actu.image}
                      alt={actu.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                )}

                {/* Contenu */}
                <div className="flex flex-col justify-center flex-1 p-6 md:p-12">
                  <span
                    className={`inline-block px-3 py-1 text-xs md:text-sm font-semibold text-white rounded-full mb-4 w-fit ${
                      TYPE_COLORS[actu.type]
                    }`}
                  >
                    {TYPE_LABELS[actu.type]}
                  </span>

                  <h3
                    className="mb-4 text-2xl font-bold md:text-4xl font-montserrat"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {actu.title}
                  </h3>

                  <p
                    className="flex items-center gap-2 mb-4 text-sm md:text-base"
                    style={{ color: "var(--color-foreground)", opacity: 0.8 }}
                  >
                    <span className="text-xl">📅</span>
                    {new Date(actu.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  <p
                    className="mb-6 text-base leading-relaxed md:text-lg"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {actu.description}
                  </p>

                  {actu.link && (
                    <a
                      href={actu.link}
                      className="inline-block px-6 py-3 text-base font-bold transition-all rounded-lg shadow-lg md:px-8 md:py-4 md:text-lg hover:scale-105 w-fit"
                      style={{
                        background: "var(--color-primary)",
                        color: "white",
                      }}
                    >
                      En savoir plus →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons précédent/suivant */}
        <button
          onClick={goToPrevious}
          className="absolute z-10 p-2 transition-all transform -translate-y-1/2 rounded-full shadow-lg top-1/2 left-4 hover:scale-110"
          style={{
            background: "var(--color-background)",
            color: "var(--color-foreground)",
          }}
          aria-label="Précédent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute z-10 p-2 transition-all transform -translate-y-1/2 rounded-full shadow-lg top-1/2 right-4 hover:scale-110"
          style={{
            background: "var(--color-background)",
            color: "var(--color-foreground)",
          }}
          aria-label="Suivant"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Indicateurs */}
        <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
          {actus.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8"
                  : "opacity-50 hover:opacity-75"
              }`}
              style={{
                background: "var(--color-primary)",
              }}
              aria-label={`Aller à l'actualité ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
