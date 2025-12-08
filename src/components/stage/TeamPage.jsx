"use client";
import team from "@/data/teachersData";
import { usePerformanceTracking } from "@/hooks/utils";
import { logger } from "@/services/logger";
import { performanceMonitor } from "@/services/performanceMonitor";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import TeacherDescr from "./TeacherDescr";
import styles from "./TeamPage.module.css";

gsap.registerPlugin(ScrollTrigger);

const TeamPage = ({ title }) => {
  usePerformanceTracking({
    componentName: "TeamPage",
    trackRender: true,
    trackMount: true,
    warnThreshold: 50,
  });
  const containerRef = useRef();
  const titleRef = useRef();
  const cardContainerRef = useRef();
  const cardContainerRef2 = useRef();

  const firstTeam = useMemo(() => team.slice(0, 3), []);
  const secondTeam = useMemo(() => team.slice(3), []);

  useEffect(() => {
    logger.debug(
      "TeamPage mounting, initializing GSAP animations",
      "TeamPage",
      {
        teamSize: team.length,
        firstTeamSize: firstTeam.length,
        secondTeamSize: secondTeam.length,
      }
    );

    const stopMeasure = performanceMonitor.startMeasure(
      "TeamPage - GSAP Init",
      "component"
    );

    const animations = [
      gsap.to(titleRef.current, {
        opacity: 1,
        right: "0",
        duration: 1.2,
        scrollTrigger: {
          trigger: containerRef.current,
          once: true,
        },
      }),
      gsap.to(cardContainerRef.current, {
        opacity: 1,
        top: "0",
        duration: 1.2,
        scrollTrigger: {
          trigger: containerRef.current,
          once: true,
        },
      }),
      gsap.to(cardContainerRef2.current, {
        opacity: 1,
        top: "0",
        duration: 1.2,
        scrollTrigger: {
          trigger: containerRef.current,
          once: true,
        },
      }),
    ];

    stopMeasure();
    logger.debug("GSAP animations initialized", "TeamPage");

    return () => {
      logger.debug("TeamPage unmounting, cleaning up GSAP", "TeamPage");
      animations.forEach((anim) => anim.kill());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [firstTeam.length, secondTeam.length]);

  return (
    <div
      ref={containerRef}
      id="team"
      className={styles.TeamContainer}
      style={{
        background: "var(--color-background-secondary-stage)",
        color: "var(--color-foreground-stage)",
        borderTop: "4px solid var(--color-border-stage)",
        boxShadow: "inset 0 10px 20px -10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h2
        ref={titleRef}
        className={styles.teamTitle}
        style={{ color: "var(--color-primary-stage)" }}
      >{`Notre Équipe d'intervenants musicaux`}</h2>
      <h3
        style={{ color: "var(--color-foreground-stage)" }}
      >{`(équipe variable selon les stages et l'effectif)`}</h3>
      <div
        ref={cardContainerRef}
        className={`${styles.cardContainer} grid gap-2 grid-cols-4 md:grid-cols-2 lg:grid-cols-3`}
      >
        {firstTeam.map((elt) => (
          <TeacherDescr key={elt.id} elt={elt} />
        ))}
      </div>
      <div
        ref={cardContainerRef2}
        className={`${styles.cardContainer} grid gap-2 grid-cols-4 md:grid-cols-2 lg:grid-cols-3`}
      >
        {secondTeam.map((elt) => (
          <TeacherDescr key={elt.id} elt={elt} />
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
