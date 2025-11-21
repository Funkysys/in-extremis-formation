// Composant: DetailRow - Ligne de détail avec label et valeur

interface DetailRowProps {
  label: string;
  value: string | number;
  color?: "green" | "orange" | "red" | "gray" | "blue";
}

export const DetailRow = ({ label, value, color }: DetailRowProps) => {
  const colorClasses = {
    green: "text-green-600",
    orange: "text-orange-600",
    red: "text-red-600",
    gray: "text-gray-600",
    blue: "text-blue-600",
  };

  return (
    <div className="flex justify-between items-center py-2 border-b">
      <span className="text-gray-600">{label}</span>
      <span
        className={`font-semibold ${
          color ? colorClasses[color] : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
};
