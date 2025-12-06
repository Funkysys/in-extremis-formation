export function ContactSection() {
  return (
    <div
      className="p-6 mt-8 rounded-lg"
      style={{
        background: "var(--color-background-secondary-stage)",
        borderLeft: "4px solid var(--color-primary-stage)",
      }}
    >
      <h3
        className="mb-4 text-2xl font-bold font-montserrat"
        style={{ color: "var(--color-primary-stage)" }}
      >
        📞 Contact
      </h3>
      <div className="space-y-3">
        <p
          className="flex items-center gap-3 text-lg"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          <span className="text-2xl">📧</span>
          <a
            href="mailto:assoinextremis@gmail.com"
            className="hover:underline"
            style={{ color: "var(--color-primary-stage)" }}
          >
            assoinextremis@gmail.com
          </a>
        </p>
        <p
          className="flex items-center gap-3 text-lg"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          <span className="text-2xl">📱</span>
          <a
            href="tel:+33746271477"
            className="hover:underline"
            style={{ color: "var(--color-primary-stage)" }}
          >
            07 46 27 14 77
          </a>
        </p>
      </div>
    </div>
  );
}
