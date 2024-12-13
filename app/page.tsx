"use client";
import Card from "@/components/Card";
import ThirdPart from "@/components/ThirdPart";
import { cards } from "@/data/cards";
import { CardType } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [fadeOut, setFadeOut] = useState(1); // Contrôle de l'opacité du texte de la première section

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY; // Récupère la position du scroll
      const sectionHeight = window.innerHeight;

      if (scrollY < sectionHeight) {
        setFadeOut(1 - scrollY / (sectionHeight / 3)); // L'opacité diminue progressivement
      } else if (scrollY >= sectionHeight / 3) {
        setFadeOut(0); // Le texte devient complètement transparent
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup pour éviter des fuites mémoire
    };
  }, []);

  return (
    <main className="overflow-y-scroll bg-sky-900">
      {/* Première section avec texte */}
      <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center relative ">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white ">
          <Image
            src="/images/logo_white.png"
            alt="Image de fond"
            width={1000}
            height={1000}
            objectFit="cover"
            className=" rounded-lg animate-fade-up animate-once animate-duration-[1000ms] animate-ease-in-out"
          />

          <h1 className="text-xl md-text-2xl xl:text-5xl font-bold hidden">
            Bienvenue sur In Extremis Formation
          </h1>
          <h2 className="text-lg md:text-xl xl:text-2xl hidden">
            Pour apprendre la musique à votre rythme !
          </h2>
        </div>
      </div>

      {/* Deuxième section avec texte */}
      <div
        className="w-[100vw] md:min-h-[100vh] pt-10 md:px-10 bg-sky-700 flex flex-col justify-center items-center opacity-0 transition-opacity duration-500 sticky top-0"
        style={{ opacity: 1 - fadeOut }} // Quand la première section disparaît, la deuxième apparaît
      >
        <h3 className="text-3xl text-white mb-5">Notre concept :</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:p-10">
          {cards.map((card: CardType) => (
            <Card
              id={card.id}
              key={card.id}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              link={card.link}
              mail={card.mail}
            />
          ))}
        </div>
      </div>
      <ThirdPart />
    </main>
  );
}
