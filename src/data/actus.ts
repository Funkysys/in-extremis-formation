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
    title: "Nos Conférences/débats en ligne",
    description:
      "Rejoignez-nous pour nos conférences/débats en ligne sur des sujets de musique et société. Nos intervenants partagent leurs expériences et réflexions sur des thèmes variés, offrant un espace d'échange et de discussion pour tous les passionnés de musique. également à retrouver sur nos chaines YouTube et Podcloud.",
    date: "2025-03-03",
    link: "https://podcloud.fr/podcast/in-extremis-society",
    image: "/images/actus/conferences.png",
    type: "event",
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
