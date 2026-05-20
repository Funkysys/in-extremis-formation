"use client";

import Image from "next/image";
import Link from "next/link";

export function TestimonialsSection() {
  const articles = [
    {
      title: "Un très beau bilan du stage de musique improvisée",
      url: "https://www.ladepeche.fr/2023/08/22/un-tres-beau-bilan-du-stage-de-musique-improvisee-11408165.php",
      icon: "📰",
      source: "La Dépêche",
    },
    {
      title: "Un stage de musique improvisée avec IN Extremis",
      url: "https://www.ladepeche.fr/2023/06/26/un-stage-de-musique-improvisee-avec-in-extremis-11301554.php",
      icon: "📰",
      source: "La Dépêche",
    },
    {
      title: "Stage de musique improvisée",
      url: "https://www.tourisme-figeac.com/offres/stage-de-musique-improvisee-cajarc-fr-4263380/",
      icon: "🏛️",
      source: "Grand Figeac Tourisme",
    },
    {
      title: "Le stage de musique improvisée fait le plein",
      url: "https://www.ladepeche.fr/2024/08/10/le-stage-de-musique-improvisee-fait-le-plein-12134909.php",
      icon: "📰",
      source: "La Dépêche",
    },
  ];

  return (
    <section
      className="w-full px-4 py-16 md:px-10"
      style={{ background: "var(--color-background-tertiary-stage)" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="mb-8 text-4xl font-bold text-center font-montserrat"
          style={{ color: "var(--color-primary-stage)" }}
        >
          Ils en parlent
        </h2>
        <p
          className="mb-12 text-lg text-center"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          Découvrez ce que la presse dit de nos stages
        </p>

        {/* Grille d'articles */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2">
          {articles.map((article, index) => (
            <Link
              key={index}
              target="_blank"
              href={article.url}
              className="p-6 transition-all rounded-lg hover:scale-105 hover:shadow-xl"
              style={{
                background: "var(--color-background-secondary-stage)",
                border: "2px solid var(--color-border-stage)",
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{article.icon}</span>
                <div>
                  <p
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--color-primary-stage)" }}
                  >
                    {article.source}
                  </p>
                  <p
                    className="font-medium"
                    style={{ color: "var(--color-foreground-stage)" }}
                  >
                    {article.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Image de presse */}
        <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-xl md:h-96">
          <Link
            target="_blank"
            href="https://www.ladepeche.fr/2024/08/10/le-stage-de-musique-improvisee-fait-le-plein-12134909.php"
          >
            <Image
              src="/images/stage_2025.jpg"
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
              alt="Article de presse sur le stage In Extremis"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
