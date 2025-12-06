interface EditorSectionProps {}

export function EditorSection({}: EditorSectionProps) {
  return (
    <section>
      <h2
        className="text-2xl font-bold mb-4 font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        1. Éditeur du site
      </h2>
      <div className="space-y-2">
        <p>
          <strong>Nom de l&apos;association :</strong> In Extremis
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
          <strong>Téléphone :</strong>{" "}
          <a
            href="tel:+33746271477"
            className="hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            07 46 27 14 77
          </a>
        </p>
      </div>
    </section>
  );
}

export function DirectorSection() {
  return (
    <section>
      <h2
        className="text-2xl font-bold mb-4 font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        2. Directeur de la publication
      </h2>
      <div className="space-y-2">
        <p>
          <strong>Nom :</strong> Antoine Delbos
        </p>
        <p>
          <strong>Adresse :</strong> 2 rue Lancefoc, Toulouse, France
        </p>
        <p>
          <strong>Email :</strong>{" "}
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

export function HostingSection() {
  return (
    <section>
      <h2
        className="text-2xl font-bold mb-4 font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        3. Hébergement
      </h2>
      <p>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
        91789, USA.
      </p>
    </section>
  );
}

export function IntellectualPropertySection() {
  return (
    <section>
      <h2
        className="text-2xl font-bold mb-4 font-montserrat"
        style={{ color: "var(--color-primary)" }}
      >
        4. Propriété intellectuelle
      </h2>
      <p>
        L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos,
        etc.) est la propriété exclusive de l&apos;association In Extremis, sauf
        mention contraire. Toute reproduction, distribution ou utilisation sans
        autorisation préalable est interdite.
      </p>
    </section>
  );
}
