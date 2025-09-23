"use client";
import Card from "@/components/vitrineUi/Card";
import ThirdPart from "@/components/vitrineUi/ThirdPart";
import { cards } from "@/data/cards";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CardType } from "../types/cards";
export default function Home() {
  const [fadeOut, setFadeOut] = useState(1);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (document.body.classList.contains("theme-dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("theme-dark")) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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
    <main
      className="overflow-x-hidden overflow-y-scroll"
      style={{ background: "var(--color-background)" }}
    >
      <div
        className="w-[100vw] h-[100vh] flex flex-col justify-center items-center relative"
        style={{
          background: "var(--color-background)",
          color: "var(--color-foreground)",
        }}
      >
        <h1 className="sr-only">
          In Extremis Formation - Éducation musicale populaire en ligne
        </h1>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ color: "var(--color-foreground)" }}
        >
          <Image
            src={
              theme === "dark"
                ? "/images/InExtremis_logo_blanc.png"
                : "/images/InExtremis_logo.png"
            }
            alt="In Extremis Formation - Éducation musicale populaire en ligne"
            width={1000}
            height={1000}
            objectFit="cover"
            className="rounded-lg animate-fade-up animate-once animate-duration-[1000ms] animate-ease-in-out border-2 border-gray-300 dark:border-gray-700"
            style={{
              background: "var(--color-background-secondary)",
              color: "var(--color-foreground)",
            }}
          />

          <p className="mt-2 text-lg text-center sr-only md:text-xl xl:text-2xl animate-fade-up animate-delay-500">
            Pour apprendre la musique à votre rythme !
          </p>
        </div>
      </div>

      <div
        className="w-[100vw] md:min-h-[100vh] pt-10 md:px-10 flex flex-col justify-center items-center opacity-0 transition-opacity duration-500 sticky top-0"
        style={{
          opacity: 1 - fadeOut,
          background: "var(--color-background-secondary)",
        }}
      >
        <h2
          className="mb-5 text-4xl font-bold font-montserrat"
          style={{
            color: "var(--color-foreground)",
          }}
        >
          Nos Propositions
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:p-10">
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
