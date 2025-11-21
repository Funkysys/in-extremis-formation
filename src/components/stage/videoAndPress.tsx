"use client";
import Image from "next/image";
import Link from "next/link";

const StagePresentation = () => {
  return (
    <section
      className="w-full py-16 px-4 md:px-10"
      style={{ background: "var(--color-background-tertiary-stage)" }}
    >
      <h2 ref={titleRef} className={styles.title}>
        Présentation
      </h2>
      <div ref={pRef} className={styles.paragraph}>
        <p>{`L’association In Extremis est très heureuse de présenter ses stages musicaux qui ont lieux à différents moments de l'année et avec plusieurs thématiques dont l'encadrement sera effectué par une équipe d'intervenants professionnels (dont la constitution variera selon l'effectif et les thématiques) :  `}</p>
        <p>Antoine Delbos (batteur et compositeur),</p>
        <p>Robin Nitram (guitariste et compositeur),</p>
        <p>Sacha Le Roy (bassiste et compositeur) et</p>
        <p>Alexandre Cajarc de Lagarrigue (saxophoniste).</p>
        <p>Le stage en quelques mots : </p>
        <p>{`Nous sommes très heureux de continuer cette aventure avec vous dans cette magnifique région qu’est le Lot. Le but de ces stages musicaux étant de partager notre passion de la musique et plus spécifiquement de l'improvisation ainsi que de donner à chacun.e l’envie de trouver sa voie à travers son parcours de musicien.ne.`}</p>
        <p>{`Ces stages sont ouverts à toutes et à tous ceux qui désirent apprendre et s’exprimer à travers la musique vivante c’est à dire la pratique de son instrument, l’écoute collective et le partage avec les autres.`}</p>
      </div>
        <h2
          className="mb-6 text-3xl font-bold text-center font-montserrat"
          style={{ color: "var(--color-primary-stage)" }}
        >
          Ils en parlent :
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-12 md:grid-cols-2">
          <Link
            target="_blank"
            href="https://www.ladepeche.fr/2023/08/22/un-tres-beau-bilan-du-stage-de-musique-improvisee-11408165.php"
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{
              background: "var(--color-background-secondary-stage)",
              color: "var(--color-primary-stage)",
            }}
          >
            📰 Cajarc. Un très beau bilan du stage de musique improvisée
          </Link>
          <Link
            target="_blank"
            href="https://www.ladepeche.fr/2023/06/26/un-stage-de-musique-improvisee-avec-in-extremis-11301554.php"
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{
              background: "var(--color-background-secondary-stage)",
              color: "var(--color-primary-stage)",
            }}
          >
            📰 Cajarc. Un stage de musique improvisée avec IN Extremis
          </Link>
          <Link
            target="_blank"
            href="https://www.tourisme-figeac.com/offres/stage-de-musique-improvisee-cajarc-fr-4263380/"
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{
              background: "var(--color-background-secondary-stage)",
              color: "var(--color-primary-stage)",
            }}
          >
            🏛️ Grand Figeac Tourisme
          </Link>
          <Link
            target="_blank"
            href="https://www.ladepeche.fr/2024/08/10/le-stage-de-musique-improvisee-fait-le-plein-12134909.php"
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{
        <h2
          className="mb-6 text-3xl font-bold text-center font-montserrat"
          style={{ color: "var(--color-primary-stage)" }}
        >
          À quoi ça ressemble ?
        </h2>
        <div className="w-full mx-auto overflow-hidden rounded-lg max-w-4xl aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/JID9BO9zPFs?si=C71u0adGZV_00and"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>    src="https://www.youtube.com/embed/JID9BO9zPFs?si=C71u0adGZV_00and"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div className="hidden xl:block">
            <iframe
              width="1080"
              height="602"
              src="https://www.youtube.com/embed/JID9BO9zPFs?si=C71u0adGZV_00and"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
