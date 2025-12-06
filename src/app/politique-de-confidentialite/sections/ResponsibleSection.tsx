export function ResponsibleSection() {
  return (
    <section>
      <h2
        className="mb-4 text-2xl font-bold font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        1. Responsable du traitement des données
      </h2>
      <div className="space-y-2">
        <p>
          <strong>Association :</strong> In Extremis
        </p>
        <p>
          <strong>Adresse :</strong> 11 rue de la Cascade, 46160 Cajarc, France
        </p>
        <p>
          <strong>Email :</strong>{" "}
          <a
            href="mailto:assoinextremis@gmail.com"
            className="hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            assoinextremis@gmail.com
          </a>
        </p>
        <p>
          <strong>Contact DPO :</strong> Antoine Delbos -{" "}
          <a
            href="mailto:antoine.delbos.developpement@gmail.com"
            className="hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            antoine.delbos.developpement@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
