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
    title: "Stage Cévenol - Improvisation Musicale",
    description:
      "Du 3 au 7 mars 2025 à Lasalle (Gard). Stage intensif d'improvisation musicale, création collective et performance finale.",
    date: "2025-03-03",
    link: "/stage/cevennole",
    image: "/images/actus/stage_cevenol.png",
    type: "stage",
  },
  {
    id: 2,
    title: "Stage SPECIAL BLUES Lotois hivernal 2026",
    description:
      "Du 27 février au 1er mars 2026 à cajarc dans le Lot, retrouvez notre stage spécial blues hivernal.",
    date: "2026-02-27",
    link: "/stage",
    image: "/images/actus/stage_hiver_lot.png",
    type: "cours",
  },
  {
    id: 3,
    title: "Nos dernières vidéos sur YouTube",
    description:
      "Découvrez nos nouvelles vidéos pédagogiques sur notre chaîne YouTube, couvrant divers aspects de la musique ou annonçant les ateliers à venir sur notre serveur discord.",
    date: "2025-11-21",
    link: "https://www.youtube.com/@AssociationInExtremis",
    image: "/images/actus/youtube.png",
    type: "news",
  },
];
