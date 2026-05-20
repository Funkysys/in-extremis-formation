"use client";

export function PresentationSection() {
  return (
    <section
      className="w-full px-4 py-16 md:px-10"
      style={{ background: "var(--color-background-tertiary-stage)" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="mb-8 text-4xl font-bold text-center font-montserrat"
          style={{ color: "var(--color-primary-stage)" }}
        >
          Présentation
        </h2>
        <div
          className="mb-12 space-y-4 text-lg leading-relaxed"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          <p>{`L'association In Extremis est très heureuse de présenter ses stages musicaux qui ont lieu à différents moments de l'année et avec plusieurs thématiques dont l'encadrement sera effectué par une équipe d'intervenants professionnels (dont la constitution variera selon l'effectif et les thématiques).`}</p>

          <p className="pt-4 font-semibold">Le stage en quelques mots :</p>
          <p>{`Nous sommes très heureux de continuer cette aventure avec vous. Le but de ces stages musicaux étant de partager notre passion de la musique et plus spécifiquement de l'improvisation ainsi que de donner à chacun.e l'envie de trouver sa voie à travers son parcours de musicien.ne.`}</p>
          <p>{`Ces stages sont ouverts à toutes et à tous ceux qui désirent apprendre et s'exprimer à travers la musique vivante c'est à dire la pratique de son instrument, l'écoute collective et le partage avec les autres.`}</p>

          <div
            className="p-6 mt-8 rounded-lg"
            style={{ background: "var(--color-background-secondary-stage)" }}
          >
            <p className="text-center text-xl italic">
              {`"La musique est une langue universelle qui nous permet de nous connecter les uns aux autres au-delà des mots."`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
