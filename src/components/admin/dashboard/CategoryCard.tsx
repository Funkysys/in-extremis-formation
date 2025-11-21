// Composant: CategoryCard - Carte de catégorie pour le dashboard

import { DetailRow } from "./DetailRow";

interface CategoryCardProps {
  title: string;
  icon: string;
  items: Array<{
    label: string;
    value: string | number;
    color?: "green" | "orange" | "red" | "gray" | "blue";
  }>;
}

export const CategoryCard = ({ title, icon, items }: CategoryCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {icon} {title}
      </h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <DetailRow key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
