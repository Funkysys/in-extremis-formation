// Composant en-tête hero pour les pages stage

interface StageHeroProps {
  title: string;
  subtitle: string;
  date: string;
  location: string;
}

export function StageHero({ title, subtitle, date, location }: StageHeroProps) {
  return (
    <div
      className="w-[100vw] h-[100vh] flex flex-col justify-center items-center relative"
      style={{
        background: "var(--color-background-stage)",
        color: "var(--color-foreground-stage)",
      }}
    >
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ color: "var(--color-foreground-stage)" }}
      >
        <div
          className="flex flex-col items-center justify-center p-8 md:p-16 lg:p-20 rounded-lg animate-fade-up animate-once animate-duration-[1000ms] animate-ease-in-out border-2"
          style={{
            background: "var(--color-background-secondary-stage)",
            borderColor: "var(--color-border-stage)",
          }}
        >
          <h1
            className="mb-6 text-4xl font-bold tracking-wide text-center md:text-6xl lg:text-7xl"
            style={{ color: "var(--color-primary-stage)" }}
          >
            {title}
          </h1>
          <h2
            className="text-2xl italic font-medium text-center md:text-3xl lg:text-4xl animate-fade-up animate-delay-500"
            style={{ color: "var(--color-foreground-stage)" }}
          >
            {subtitle}
          </h2>
          <p
            className="mt-4 text-lg text-center animate-fade-up animate-delay-700"
            style={{ color: "var(--color-foreground-stage)" }}
          >
            {date} • {location}
          </p>
        </div>
      </div>
    </div>
  );
}
