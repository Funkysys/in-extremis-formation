export const datas = [
  {
    id: "1",
    title: "Stage du Lot",
    description:
      "Nos stages d’origines proposants divers formats du stage d’improvisation sur 5 jours au stage thématique sur 3 jours ",
    imageUrl: "/images/ecole_de_musique.jpg",
    link: "/stage/lot/",
    message: "Voir la page",
  },
  {
    id: "2",
    title: "Stage Cévenole",
    description:
      "Notre nouveau stage d’improvisation musical à Lasalle Dans le Gard du 3 au 7 marsLes inscriptions sont ouvertes ! ",
    imageUrl: "/images/lassale.png",
    link: "/stage/cevennole",
    message: "Voir la page",
  },
  {
    id: "3",
    title: "Stage Breton",
    description:
      "Stage d'improvisation musicale en Bretagne, à la Malterie de Cleguer du 10 au 12 juillet 2026. 3 jours de création collective. Les inscriptions sont ouvertes !",
    imageUrl: "/images/bretagne.png",
    link: "/stage/bretagne",
    message: "Voir la page",
  },
];

// Données complètes des stages
export const stagesDetailsData = {
  lot: {
    fevrier: {
      title: "Stage du Lot - Février",
      subtitle: "Improvisation Musicale",
      dates: "Du 18 au 20 février 2026",
      location: "Lot (46)",
      locationDetails: "Art et Scène, 16 Av. de la Gare, 46160 Cajarc",
      description:
        "Notre stage d'hiver proposant 3 jours d'improvisation musicale intensive.",
      schedule: "10h00 - 18h00 avec pause déjeuner 12h30 - 14h00",
      program: [
        "Techniques d'improvisation",
        "Travail en groupe",
        "Création collective",
        "Performance finale",
      ],
      prices: {
        full: "300€",
        reduced: "275€",
        minor: "150€",
      },
      reducedInfo: "adhérents aux écoles de musique du Lot",
      minorInfo: "moins de 16 ans adhérents aux écoles de musique du Lot",
      accommodation:
        "Des options d'hébergement en gîte ou en auberge sont disponibles à proximité. Merci de nous contacter pour plus d'informations.",
      meals:
        "Hébergement et repas non inclus. Possibilité de restauration sur place ou à proximité.",
      registration: {
        unavailable: true as const,
        message: "Documents d'inscription indisponibles pour le moment",
      },
      image: "/images/ecole_de_musique.jpg",
      venues:
        "Jam Session ouverte par les étudiants le vendredi 20 février à l'école de musique Art et Scène de Cajarc",
    },
    juillet: {
      title: "Stage du Lot - Juillet",
      subtitle: "Improvisation Musicale",
      dates: "Du 29 au 31 juillet 2026",
      location: "Lot (46)",
      locationDetails: "Art et Scène, 16 Av. de la Gare, 46160 Cajarc",
      description:
        "Notre stage d'été proposant 3 jours d'improvisation musicale intensive. Un format compact pour découvrir les techniques d'improvisation utilisées dans le jazz et la musique actuelle.",
      schedule: "10h00 - 18h00 avec pause déjeuner 12h30 - 14h00",
      program: [
        "Techniques d'improvisation",
        "Travail en groupe",
        "Création collective",
        "Performance finale",
      ],
      prices: {
        full: "300€",
        reduced: "275€",
        minor: "150€",
      },
      reducedInfo: "adhérents aux écoles de musique du Lot",
      minorInfo: "moins de 16 ans adhérents aux écoles de musique du Lot",
      accommodation:
        "Des options d'hébergement en gîte ou en auberge sont disponibles à proximité. Merci de nous contacter pour plus d'informations.",
      meals:
        "Hébergement et repas non inclus. Possibilité de restauration sur place ou à proximité.",
      registration: {
        description: "/images/lot/juillet/description_2026_juillet.pdf",
        form: "/images/lot/juillet/formulaire_inscription_juillet26.pdf",
        parental: "/images/lot/juillet/autorisation_parentale_2026.pdf",
        image: "/images/lot/juillet/autorisation_parentale_2026_image.pdf",
      },
      image: "/images/ecole_de_musique.jpg",
      venues:
        "Jam Session ouverte par les étudiants le vendredi 31 juillet à l'école de musique Art et Scène de Cajarc",
    },
    aout: {
      title: "Stage du Lot - Août",
      subtitle: "Improvisation Musicale",
      dates: "Du 3 au 7 août 2026",
      location: "Lot (46)",
      locationDetails: "Art et Scène, 16 Av. de la Gare, 46160 Cajarc",
      description:
        "Notre stage historique proposant 5 jours d'improvisation musicale intensive. Un format plus long pour une immersion totale dans la création collective et l'exploration des techniques d'improvisation.",
      schedule: "10h00 - 18h00 avec pause déjeuner 12h30 - 14h00",
      program: [
        "Techniques d'improvisation",
        "Travail en groupe",
        "Création collective",
        "Performance finale",
      ],
      prices: {
        full: "400€",
        reduced: "375€",
        minor: "200€",
      },
      reducedInfo: "adhérents aux écoles de musique du Lot",
      minorInfo: "moins de 16 ans adhérents aux écoles de musique du Lot",
      accommodation:
        "Des options d'hébergement en gîte ou en auberge sont disponibles à proximité. Merci de nous contacter pour plus d'informations.",
      meals:
        "Hébergement et repas non inclus. Possibilité de restauration sur place ou à proximité.",
      registration: {
        description: "/images/lot/aout/description_2026.pdf",
        form: "/images/lot/aout/formulaire_inscription_aout2026.pdf",
        parental: "/images/lot/aout/autorisation_parentale_aout2026.pdf",
        image: "/images/lot/aout/autorisation_parentale_aout2026_image.pdf",
      },
      image: "/images/ecole_de_musique.jpg",
      venues:
        "Jam Session ouverte par les étudiants le jeudi 6 Août au théatre de verdure de Cajarc et le vendredi 7 Août Concert de restitution à l'auditorium de l'école de musique Art et Scène de Cajarc",
    },
  },
  cevennes: {
    title: "Stage Cévenol",
    subtitle: "Improvisation Musicale",
    dates: "Du 3 au 7 mars 2025",
    location: "Lasalle, Gard (30)",
    locationDetails: "La Cure, 15 rue henri mallol, 30460 Lasalle",
    description:
      "Notre nouveau stage d'improvisation musicale dans le magnifique cadre des Cévennes. 5 jours de création collective intensive.",
    schedule:
      "Lundi au vendredi : 10h00 - 18h00 avec pause déjeuner 12h30 - 14h00",
    program: [
      "Techniques d'improvisation",
      "Travail en groupe",
      "Création collective",
      "Performance finale",
    ],
    prices: {
      full: "380€",
      reduced: "350€",
      minor: "200€",
    },
    reducedInfo: "adhérents à l'association l'Art Scène",
    minorInfo: "moins de 16 ans adhérents à l'association l'Art Scène",
    accommodation:
      "Des options d'hébergement en gîte ou en auberge sont disponibles à proximité. Merci de nous contacter pour plus d'informations.",
    meals:
      'Une proposition de repas végétarien est faite par le food truck "Judith" dans la salle associative pour un moment de convivialité entre étudiants et intervenants.\n- 12€ assiette repas + dessert\n- 15€ entrée + plat + dessert\n- Possibilité d\'apporter son propre repas',
    venues:
      "Restitutions :\n• La Ballade + Jam : restaurant associatif à Soudorgues\n• La Filature : https://www.lasalle.fr/lieux/filature-du-pont-de-fer",
    registration: {
      description: "/images/description_cev_2026.pdf",
      form: "/images/formulaire_inscription_cev26.pdf",
      image: "/images/autorisation_image_cev_2026.pdf",
    },
    image: "/images/lassale.png",
  },
  bretagne: {
    title: "Stage Breton",
    subtitle: "Improvisation Musicale",
    dates: "Du 10 au 12 juillet 2026",
    location: "Cleguer, Bretagne",
    locationDetails: "La Malterie, Cleguer (56)",
    description:
      "Stage d'improvisation musicale en Bretagne. 3 jours de création collective dans le cadre inspirant de la Malterie de Cleguer.",
    schedule: "10h00 - 18h00 avec pause déjeuner 12h30 - 14h00",
    program: [
      "Techniques d'improvisation",
      "Travail en groupe",
      "Création collective",
      "Performance finale",
    ],
    prices: {
      full: "300€",
      minor: "150€",
    },
    minorInfo: "Jeunes moins de 16 ans",
    accommodation:
      "Des options d'hébergement en gîte ou en auberge sont disponibles à proximité. Merci de contacter l'office du tourisme locale pour plus d'informations.",
    meals: "Hébergement et repas non inclus",
    registration: {
      form: "/images/formulaire_inscription_bretagne_juillet26.pdf",
    },
    image: "/images/bretagne.png",
    venues:
      "Jam Session ouverte par les étudiants le Samedi 11 Juillet à La Malterie",
  },
};
