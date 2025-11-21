"use client";

import Card from "@/components/vitrineUi/Card";
import { datas } from "@/data/stages";
import { usePerformanceTracking } from "@/hooks/usePerformanceTracking";
import { logger } from "@/services/logger";
import { CardType } from "@/types/cards";
import { useCallback, useEffect, useRef, useState } from "react";

const StageContent = () => {
  usePerformanceTracking({
    componentName: "StageContent",
    trackRender: true,
    trackMount: true,
    warnThreshold: 16,
  });
  const [fadeOut, setFadeOut] = useState(1);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | undefined>(
    undefined
  );

  const handleScroll = useCallback(() => {
    if (rafRef.current !== undefined) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const sectionHeight = window.innerHeight;

      if (scrollY < sectionHeight) {
        setFadeOut(1 - scrollY / (sectionHeight / 3));
      } else if (scrollY >= sectionHeight / 3) {
        setFadeOut(0);
      }
    });
  }, []);

  useEffect(() => {
    logger.debug("StageContent initialized", "StageContent", {
      dataCount: datas?.length,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);
  return (
    <section>
      {datas && datas.length > 0 && (
        <div
          className="w-[100vw] md:min-h-[100vh] pt-10 md:px-10 flex flex-col justify-center items-center opacity-0 transition-opacity duration-500 sticky top-0"
          style={{
            opacity: 1 - fadeOut,
            background: "var(--color-background-secondary-stage)",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <h3
              className="mb-12 text-3xl italic text-center"
              style={{ color: "var(--color-foreground-stage)" }}
            >
              Retrouvez nos différents Stages d’improvisation musicale
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
              {datas.map((data: CardType) => (
                <Card
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  description={data.description}
                  imageUrl={data.imageUrl}
                  link={data.link}
                  mail={data.mail}
                  message={data.message}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StageContent;
