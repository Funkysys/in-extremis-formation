import { Metadata } from "next";

interface FormationPageProps {
  params: {
    title: string;
  };
}

export async function generateMetadata({
  params,
}: FormationPageProps): Promise<Metadata> {
  // TODO: Récupérer les vraies données du cours depuis GraphQL
  const courseTitle = decodeURIComponent(params.title);
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.inextremisformation.fr";

  return {
    title: courseTitle,
    description: `Découvrez la formation ${courseTitle} sur In Extremis Formation`,
    openGraph: {
      title: courseTitle,
      description: `Apprenez ${courseTitle} à votre rythme avec des cours personnalisés`,
      type: "video.other",
      url: `${baseUrl}/formation/${params.title}`,
      images: [
        {
          url: `${baseUrl}/images/logo_white.png`, // TODO: Utiliser la miniature du cours
          width: 1200,
          height: 630,
          alt: courseTitle,
        },
      ],
      siteName: "In Extremis Formation",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: courseTitle,
      description: `Découvrez la formation ${courseTitle}`,
      images: [`${baseUrl}/images/logo_white.png`],
    },
  };
}

export default function FormationPage({ params }: FormationPageProps) {
  return <div>Formation Page: {decodeURIComponent(params.title)}</div>;
}
