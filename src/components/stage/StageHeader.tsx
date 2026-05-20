"use client";

interface StageHeaderProps {
  title: string;
  subtitle: string;
  description: string;
}

export function StageHeader({
  title,
  subtitle,
  description,
}: StageHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h3
        className="text-3xl font-bold mb-2"
        style={{ color: "var(--color-primary-stage)" }}
      >
        {title}
      </h3>
      <p
        className="text-xl italic"
        style={{ color: "var(--color-foreground-stage)" }}
      >
        {subtitle}
      </p>
      <p
        className="text-lg mt-2"
        style={{ color: "var(--color-foreground-stage)" }}
      >
        {description}
      </p>
    </div>
  );
}
