import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="px-4 py-12"
      style={{ background: "var(--color-background-secondary)" }}
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
          {/* Section À propos */}
          <div>
            <h3
              className="mb-4 text-xl font-bold font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              In Extremis Formation
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-foreground)", opacity: 0.8 }}
            >
              Association dédiée à l&apos;enseignement musical et à
              l&apos;improvisation. Stages, formations et cours pour tous
              niveaux.
            </p>
          </div>

          {/* Section Contact */}
          <div>
            <h3
              className="mb-4 text-xl font-bold font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              📞 Contact
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:assoinextremis@gmail.com"
                className="flex items-center gap-3 text-sm transition-colors hover:underline group"
                style={{ color: "var(--color-foreground)" }}
              >
                <span
                  className="text-lg transition-transform group-hover:scale-110"
                  style={{ color: "var(--color-primary)" }}
                >
                  📧
                </span>
                <span>assoinextremis@gmail.com</span>
              </a>
              <a
                href="tel:+33746271477"
                className="flex items-center gap-3 text-sm transition-colors hover:underline group"
                style={{ color: "var(--color-foreground)" }}
              >
                <span
                  className="text-lg transition-transform group-hover:scale-110"
                  style={{ color: "var(--color-primary)" }}
                >
                  📱
                </span>
                <span>07 46 27 14 77</span>
              </a>
            </div>
          </div>

          {/* Section Navigation rapide */}
          <div>
            <h3
              className="mb-4 text-xl font-bold font-montserrat"
              style={{ color: "var(--color-primary)" }}
            >
              Navigation
            </h3>
            <nav className="space-y-2">
              <Link
                href="/"
                className="block text-sm transition-colors hover:underline"
                style={{ color: "var(--color-foreground)", opacity: 0.8 }}
              >
                Accueil
              </Link>
              {/* <Link
                href="/formation"
                className="block text-sm transition-colors hover:underline"
                style={{ color: "var(--color-foreground)", opacity: 0.8 }}
              >
                Formations
              </Link> */}
              <Link
                href="/stage"
                className="block text-sm transition-colors hover:underline"
                style={{ color: "var(--color-foreground)", opacity: 0.8 }}
              >
                Stages
              </Link>
            </nav>
          </div>
        </div>

        {/* Séparateur */}
        <div
          className="h-px mb-6"
          style={{ background: "var(--color-border)", opacity: 0.3 }}
        />

        {/* Copyright et liens légaux */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-sm text-center md:text-left"
            style={{ color: "var(--color-foreground)", opacity: 0.6 }}
          >
            © 2025 In Extremis Formation. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-sm">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:underline"
              style={{ color: "var(--color-foreground)", opacity: 0.6 }}
            >
              Mentions légales
            </Link>
            <span style={{ color: "var(--color-foreground)", opacity: 0.3 }}>
              |
            </span>
            <Link
              href="/politique-de-confidentialite"
              className="transition-colors hover:underline"
              style={{ color: "var(--color-foreground)", opacity: 0.6 }}
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
