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
    title: "Stage Breton - Improvisation Musicale",
    description:
      "Du 3 au 7 mars 2025 à Lasalle (Gard). Stage intensif d'improvisation musicale, création collective et performance finale.",
    date: "2025-03-03",
    link: "/stage/breton",
    image: "/images/actus/stage_breton.png",
    type: "stage",
  },
  {
    id: 2,
    title: "Nos Conférences débats sur les thèmes de musique et société",
    description:
      "Rejoignez-nous pour nos prochaines conférences débats sur les thèmes de musique et société, avec des intervenants passionnants et des discussions enrichissantes. Sinon, vous pouvez aussi les voirs en replay sur notre chaîne YouTube ou en podcast sur Podcloud !",
    date: "2026-02-27",
    link: "/conferences",
    image: "/images/actus/conferences.png",
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
