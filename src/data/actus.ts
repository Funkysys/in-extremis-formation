// Données des actualités pour le carrousel de la page d'accueil

export interface Actu {
  id: number;
  title: string;
  description: string;
  date: string;
  link?: string;
  image?: string;
  type: "stage" | "cours" | "event" | "news";
}

export const actus: Actu[] = [
  {
    id: 1,
    title: "Stages d'Improvisation Musicale 2026",
    description:
      "Découvrez nos différents stages d'improvisation musicale : Stage du Lot (février, juillet, août), Stage Cévenol (mars) et Stage Breton (juillet). Des moments uniques pour explorer la création collective et développer votre pratique musicale.",
    date: "2026-02-01",
    link: "/stage",
    image: "/images/actus/stages.png",
    type: "stage",
  },
  {
    id: 2,
    title: "Stage Cévenol - Mars 2025",
    description:
      "Du 3 au 7 mars 2025 à Lasalle (Gard). Stage intensif d'improvisation musicale de 5 jours dans le magnifique cadre des Cévennes. Création collective, techniques d'improvisation et performance finale.",
    date: "2025-03-03",
    link: "/stage",
    image: "/images/actus/stage_cevenol.png",
    type: "stage",
  },
  {
    id: 3,
    title: "Nos dernières vidéos sur YouTube",
    description:
      "Découvrez nos nouvelles vidéos pédagogiques sur notre chaîne YouTube : tutoriels, ateliers en ligne, conférences et annonces des prochains événements sur notre serveur Discord.",
    date: "2025-11-21",
    link: "https://www.youtube.com/@AssociationInExtremis",
    image: "/images/actus/youtube.png",
    type: "news",
  },
];
