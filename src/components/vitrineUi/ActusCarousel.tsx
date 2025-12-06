"use client";

import { actus } from "@/data/actus";
import { useCarouselAutoplay } from "./ActusCarousel/useCarouselAutoplay";
import { ActuCard } from "./ActusCarousel/ActuCard";
import { CarouselNavigation } from "./ActusCarousel/CarouselNavigation";

export default function ActusCarousel() {
  const { currentIndex, navigate } = useCarouselAutoplay(actus.length);

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
            <ActuCard key={actu.id} actu={actu} />
          ))}
        </div>

        <CarouselNavigation
          currentIndex={currentIndex}
          totalItems={actus.length}
          onNavigate={navigate}
        />
      </div>
    </div>
  );
}
