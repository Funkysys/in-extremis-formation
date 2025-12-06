export function AccommodationSection() {
  return (
    <div
      className="p-6 mt-10 rounded-lg"
      style={{
        background: "var(--color-background-secondary-stage)",
      }}
    >
      <h4
        className="mb-4 text-2xl font-bold"
        style={{ color: "var(--color-primary-stage)" }}
      >
        Hébergement & Repas
      </h4>
      <p style={{ color: "var(--color-foreground-stage)" }}>
        <strong>Repas :</strong> Une proposition de repas végétarien est faite
        par le food truck {`"Judith"`} dans la salle associative pour un moment
        de convivialité entre étudiants et Intervenants.
        <br />
        - 12€ assiette repas + déssert
        <br />
        - 15€ entrée + plat + dessert
        <br />- possibilité {`d'apporter`} son propre repas
        <br />
        <strong>
          Hébergement : des options d&apos;hébergement en gîte ou en auberge
          sont disponibles à proximité.
        </strong>
        <br />
        Merci de nous contacter pour plus d&apos;informations.
      </p>
    </div>
  );
}
