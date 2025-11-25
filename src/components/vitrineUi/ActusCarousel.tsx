"use client";

import { actus, type Actu } from "@/data/actus";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ActusCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % actus.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + actus.length) % actus.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % actus.length);
    setIsAutoPlaying(false);
  };

  const getTypeColor = (type: Actu["type"]) => {
    switch (type) {
      case "stage":
        return "bg-purple-500";
      case "cours":
        return "bg-blue-500";
      case "event":
        return "bg-green-500";
      case "news":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeLabel = (type: Actu["type"]) => {
    switch (type) {
      case "stage":
        return "Stage";
      case "cours":
        return "Cours";
      case "event":
        return "Événement";
      case "news":
        return "Actualité";
      default:
        return "";
    }
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
        className="relative overflow-hidden rounded-xl shadow-2xl border-2 h-auto min-h-[600px] md:h-[80vh] flex flex-col"
        style={{
          background: "var(--color-background)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Carrousel */}
        <div
          className="flex flex-1 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {actus.map((actu) => (
            <div
              key={actu.id}
              className="flex items-stretch flex-shrink-0 w-full h-full"
            >
              <div className="flex flex-col w-full h-full md:flex-row">
                {/* Image pleine hauteur à gauche */}
                {actu.image && (
                  <div className="flex-shrink-0 w-full md:w-1/2 h-1/2 md:h-full">
                    <div
                      className="w-full h-full"
                      style={{
                        background: "var(--color-background-secondary)",
                      }}
                    >
                      <Image
                        src={actu.image}
                        alt={actu.title}
                        className="object-cover w-full h-full"
                        width={500}
                        height={500}
                      />
                    </div>
                  </div>
                )}

                {/* Contenu à droite */}
                <div
                  className={`flex-1 flex flex-col justify-center p-6 md:p-16 h-1/2 md:h-auto ${
                    !actu.image ? "items-center text-center" : ""
                  }`}
                >
                  {/* Badge type */}
                  <span
                    className={`inline-block px-4 py-2 text-sm font-semibold text-white rounded-full mb-6 w-fit ${getTypeColor(
                      actu.type
                    )}`}
                  >
                    {getTypeLabel(actu.type)}
                  </span>

                  {/* Titre */}
                  <h3
                    className="mb-6 text-4xl font-bold md:text-5xl font-montserrat"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {actu.title}
                  </h3>

                  {/* Date */}
                  <p
                    className="flex items-center gap-2 mb-8 text-lg font-medium"
                    style={{ color: "var(--color-foreground)", opacity: 0.8 }}
                  >
                    <span className="text-2xl">📅</span>
                    {new Date(actu.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {/* Description */}
                  <p
                    className="max-w-xl mb-10 text-xl leading-relaxed"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {actu.description}
                  </p>

                  {/* Bouton CTA */}
                  {actu.link && (
                    <Link
                      href={actu.link}
                      className="inline-block px-10 py-5 text-xl font-bold transition-all duration-300 rounded-lg shadow-xl hover:scale-105 w-fit"
                      style={{
                        background: "var(--color-primary)",
                        color: "var(--color-primary-foreground)",
                      }}
                    >
                      En savoir plus →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons de navigation */}
        {actus.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute hidden p-3 transition-all duration-300 -translate-y-1/2 rounded-full shadow-lg md:block left-4 top-1/2 hover:scale-110"
              style={{
                background: "var(--color-background-secondary)",
                color: "var(--color-foreground)",
              }}
              aria-label="Actualité précédente"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute hidden p-3 transition-all duration-300 -translate-y-1/2 rounded-full shadow-lg md:block right-4 top-1/2 hover:scale-110"
              style={{
                background: "var(--color-background-secondary)",
                color: "var(--color-foreground)",
              }}
              aria-label="Actualité suivante"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Indicateurs de pagination */}
        {actus.length > 1 && (
          <div className="flex justify-center gap-2 py-4">
            {actus.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="h-2 transition-all duration-300 rounded-full"
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
        )}
      </div>
    </div>
  );
}
