// Composant carte d'information pour les pages stage

interface StageInfoCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

export function StageInfoCard({ icon, title, children }: StageInfoCardProps) {
  return (
    <div
      className="p-6 rounded-lg"
      style={{
        background: "var(--color-background-secondary-stage)",
      }}
    >
      <h4
        className="mb-4 text-2xl font-bold"
        style={{ color: "var(--color-primary-stage)" }}
      >
        {icon} {title}
      </h4>
      <div style={{ color: "var(--color-foreground-stage)" }}>{children}</div>
    </div>
  );
}
