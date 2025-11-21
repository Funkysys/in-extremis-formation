"use client";
import { usePerformanceTracking } from "@/hooks/usePerformanceTracking";
import { usePrefetchOnHover } from "@/hooks/usePrefetch";
import { useTheme } from "@/providers/ThemeProvider";
import { CardType } from "@/types";
import { getBlurDataURL } from "@/utils/imageOptimization";
import Image from "next/image";
import Link from "next/link";

const Card = ({
  id,
  title,
  description,
  imageUrl,
  link,
  mail,
  message,
}: CardType) => {
  usePerformanceTracking({
    componentName: `Card-${id}`,
    trackRender: true,
    trackMount: false,
    warnThreshold: 10,
  });

  const { isStageContext } = useTheme();

  // Prefetch au hover - toujours appeler le hook (règles React Hooks)
  const prefetchProps = usePrefetchOnHover({
    query: {} as Record<string, unknown>,
    variables: { id },
    enabled: !!link, // Activer seulement si link existe
  });

  return (
    <article
      key={id}
      className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-[80vh] lg:h-[70vh] flex flex-col"
      style={{
        background: isStageContext
          ? "var(--color-background-tertiary-stage)"
          : "#e6f4fe",
      }}
    >
      {imageUrl && (
        <figure className="w-full h-[100%] lg:h-[60%] relative mb-4">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-lg object-cover"
            placeholder="blur"
            blurDataURL={getBlurDataURL()}
            quality={75}
          />
        </figure>
      )}

      <div className="flex flex-col items-start justify-between flex-grow">
        <header>
          <h3
            className="mb-4 text-xl font-bold"
            style={{
              color: isStageContext
                ? "var(--color-foreground-stage)"
                : "#1f2d5c",
            }}
          >
            {title}
          </h3>
        </header>
        <p
          className="text-lg"
          style={{
            color: isStageContext
              ? "var(--color-foreground-stage)"
              : "var(--color-background)",
          }}
        >
          {description}
        </p>
        <footer className="w-full mt-4">
          {mail && (
            <Link
              href={`mailto:${mail}`}
              className="inline-block px-4 py-2 transition-colors duration-300 rounded-md"
              style={{
                backgroundColor: isStageContext
                  ? "var(--color-button-bg-stage)"
                  : "#2A3B61",
                color: isStageContext
                  ? "var(--color-button-text-stage)"
                  : "white",
              }}
              onMouseEnter={(e) => {
                if (isStageContext) {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-button-hover-bg-stage)";
                  e.currentTarget.style.color =
                    "var(--color-button-hover-text-stage)";
                } else {
                  e.currentTarget.style.backgroundColor = "#422D68";
                }
              }}
              onMouseLeave={(e) => {
                if (isStageContext) {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-button-bg-stage)";
                  e.currentTarget.style.color =
                    "var(--color-button-text-stage)";
                } else {
                  e.currentTarget.style.backgroundColor = "#2A3B61";
                }
              }}
              aria-label={`Contacter ${title}`}
            >
              Nous contacter
            </Link>
          )}

          {link && (
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 transition-colors duration-300 rounded-md"
              {...prefetchProps}
              style={{
                backgroundColor: isStageContext
                  ? "var(--color-button-bg-stage)"
                  : "#2A3B61",
                color: isStageContext
                  ? "var(--color-button-text-stage)"
                  : "white",
              }}
              onMouseEnter={(e) => {
                if (isStageContext) {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-button-hover-bg-stage)";
                  e.currentTarget.style.color =
                    "var(--color-button-hover-text-stage)";
                } else {
                  e.currentTarget.style.backgroundColor = "#422D68";
                }
              }}
              onMouseLeave={(e) => {
                if (isStageContext) {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-button-bg-stage)";
                  e.currentTarget.style.color =
                    "var(--color-button-text-stage)";
                } else {
                  e.currentTarget.style.backgroundColor = "#2A3B61";
                }
              }}
              aria-label={`Rejoindre ${title}`}
            >
              {message ? message : "Nous rejoindre"}
            </Link>
          )}
        </footer>
      </div>
    </article>
  );
};

export default Card;
