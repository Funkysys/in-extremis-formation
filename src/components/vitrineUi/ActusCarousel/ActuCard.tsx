import Image from "next/image";

interface ActuCardProps {
  actu: {
    id: number;
    title: string;
    description: string;
    date: string;
    type: "stage" | "cours" | "event" | "news";
    image?: string;
    link?: string;
  };
}

const TYPE_COLORS = {
  stage: "bg-purple-500",
  cours: "bg-blue-500",
  event: "bg-green-500",
  news: "bg-orange-500",
} as const;

const TYPE_LABELS = {
  stage: "Stage",
  cours: "Cours",
  event: "Événement",
  news: "Actualité",
} as const;

export function ActuCard({ actu }: ActuCardProps) {
  return (
    <div className="flex flex-col flex-shrink-0 w-full h-full md:flex-row">
      {actu.image && (
        <div className="flex-shrink-0 w-full md:w-1/2 h-1/2 md:h-full">
          <Image
            src={actu.image}
            alt={actu.title}
            fill
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="p-4 md:p-16">
        <span
          className={`inline-block px-3 py-1 text-xs md:text-sm font-semibold text-white rounded-full mb-3 md:mb-6 ${
            TYPE_COLORS[actu.type]
          }`}
        >
          {TYPE_LABELS[actu.type]}
        </span>
        <h3
          className="mb-3 text-2xl font-bold md:mb-6 md:text-5xl font-montserrat"
          style={{ color: "var(--color-foreground)" }}
        >
          {actu.title}
        </h3>
        <p
          className="flex items-center gap-2 mb-3 text-sm font-medium md:mb-8 md:text-lg"
          style={{ color: "var(--color-foreground)", opacity: 0.8 }}
        >
          <span className="text-lg md:text-2xl">📅</span>
          {new Date(actu.date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p
          className="mb-auto text-sm leading-relaxed md:mb-10 md:text-xl"
          style={{ color: "var(--color-foreground)" }}
        >
          {actu.description}
        </p>

        {actu.link && (
          <a
            href={actu.link}
            className="inline-block px-6 py-3 mt-4 text-base font-bold transition-all rounded-lg shadow-xl group md:px-10 md:py-5 md:text-xl hover:scale-105 w-fit md:mt-6"
            style={{
              background: "var(--color-button-hover-bg)",
              color: "var(--color-primary-foreground)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--color-button-bg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "var(--color-button-hover-bg)")
            }
          >
            En savoir plus →
          </a>
        )}
      </div>
    </div>
  );
}
