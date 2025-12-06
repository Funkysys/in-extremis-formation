export function VenuesSection() {
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
        Les restitutions
      </h4>
      <strong style={{ color: "var(--color-foreground-stage)" }}>
        La Ballade + Jam:
      </strong>
      <br />
      restaurant associatif à Soudorgues
      <br />
      <br />
      <strong style={{ color: "var(--color-foreground-stage)" }}>
        La Filature:
      </strong>
      <br />
      <a
        href="https://www.lasalle.fr/lieux/filature-du-pont-de-fer"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--color-primary-stage)",
          textDecoration: "underline",
        }}
      >
        site de la Filature
      </a>
    </div>
  );
}
