import { FeatureItem } from "./FeatureItem";

const PREMIUM_FEATURES = [
  "Accès illimité à toutes les formations",
  "Téléchargement des vidéos hors ligne",
  "Support prioritaire",
  "Certificats de formation",
];

interface FeatureListProps {
  variant: "active" | "upgrade";
}

export function FeatureList({ variant }: FeatureListProps) {
  const iconColor = variant === "active" ? "text-yellow-600" : "text-blue-600";
  const textColor = variant === "active" ? "text-yellow-900" : "text-gray-700";

  return (
    <ul className="space-y-2 mb-4">
      {PREMIUM_FEATURES.map((feature, index) => (
        <li key={index} className={textColor}>
          <FeatureItem text={feature} iconColor={iconColor} />
        </li>
      ))}
    </ul>
  );
}
