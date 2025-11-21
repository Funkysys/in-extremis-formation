import StageContent from "@/components/stage/StageContent";
import StagePresentation from "@/components/stage/StagePresentation";
import TeamPage from "@/components/stage/TeamPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stages de Musique - In Extremis Formation",
  description:
    "Participez à nos stages de musique intensifs. Improvisation, création collective, et perfectionnement musical avec des professionnels. Stages résidentiels dans le Gard et autres régions.",
  keywords:
    "stage musique, stage intensif musique, stage improvisation, stage collectif musique, formation musicale intensive, stage chant, stage instrumental, weekend musical",
  openGraph: {
    title: "Stages de Musique - In Extremis Formation",
    description:
      "Stages intensifs de musique : improvisation, création collective, perfectionnement. Encadrement professionnel.",
    url: "https://www.inextremisformation.fr/stage",
    type: "website",
    images: [
      {
        url: "https://www.inextremisformation.fr/images/logo_white.png",
        width: 1200,
        height: 630,
        alt: "Stages de musique In Extremis Formation",
      },
    ],
  },
};

const StagePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationEvent",
            name: "Stages de Musique In Extremis",
            description:
              "Stages intensifs de musique : improvisation, création collective, perfectionnement musical",
            organizer: {
              "@type": "EducationalOrganization",
              name: "In Extremis Formation",
              url: "https://www.inextremisformation.fr",
            },
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
          }),
        }}
      />
      <main
        className="overflow-x-hidden overflow-y-scroll"
        style={{ background: "var(--color-background-stage)" }}
      >
        <header
          className="w-[100vw] h-[100vh] flex flex-col justify-center items-center relative"
          style={{
            background: "var(--color-background-stage)",
            color: "var(--color-foreground-stage)",
          }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ color: "var(--color-foreground-stage)" }}
          >
            <div
              className="flex flex-col items-center justify-center p-8 md:p-16 lg:p-20 rounded-lg animate-fade-up animate-once animate-duration-[1000ms] animate-ease-in-out border-2"
              style={{
                background: "var(--color-background-secondary-stage)",
                borderColor: "var(--color-border-stage)",
              }}
            >
              <h1
                className="mb-6 text-4xl font-bold tracking-wide text-center md:text-6xl lg:text-7xl"
                style={{ color: "var(--color-primary-stage)" }}
              >
                IN EXTREMIS
              </h1>
              <p
                className="text-2xl italic font-medium text-center md:text-3xl lg:text-4xl animate-fade-up animate-delay-500"
                style={{ color: "var(--color-foreground-stage)" }}
              >
                STAGES
              </p>
            </div>
          </div>
        </header>
        <StageContent />
        <StagePresentation />
        <TeamPage title={"Notre équipe"} />
      </main>
    </>
  );
};

export default StagePage;
