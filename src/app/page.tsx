"use client";
import Card from "@/components/vitrineUi/Card";
import ThirdPart from "@/components/vitrineUi/ThirdPart";
import { cards } from "@/data/cards";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CardType } from "../types";

export default function Home() {
  const [fadeOut, setFadeOut] = useState(1);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectionHeight = window.innerHeight;

      if (scrollY < sectionHeight) {
        setFadeOut(1 - scrollY / (sectionHeight / 3));
      } else if (scrollY >= sectionHeight / 3) {
        setFadeOut(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="overflow-y-scroll overflow-x-hidden bg-sky-900">
      <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center relative">
        <h1 className="sr-only">
          In Extremis Formation - Éducation musicale populaire en ligne
        </h1>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <Image
            src="/images/logo_white.png"
            alt="In Extremis Formation - Éducation musicale populaire en ligne"
            width={1000}
            height={1000}
            objectFit="cover"
            className="rounded-lg animate-fade-up animate-once animate-duration-[1000ms] animate-ease-in-out"
          />

          <p className="text-lg md:text-xl xl:text-2xl mt-2 text-center animate-fade-up animate-delay-500 sr-only">
            Pour apprendre la musique à votre rythme !
          </p>
        </div>
      </div>

      <div
        className="w-[100vw] md:min-h-[100vh] pt-10 md:px-10 bg-sky-700 flex flex-col justify-center items-center opacity-0 transition-opacity duration-500 sticky top-0"
        style={{ opacity: 1 - fadeOut }}
      >
        <h2 className="text-3xl text-white mb-5 font-roboto border-b">
          Nos Propositions :
        </h2>
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
