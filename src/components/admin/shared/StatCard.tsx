// Composant: StatCard - Carte de statistique

import { STAT_COLORS } from "@/lib/admin/constants";
import { StatCardProps } from "@/lib/admin/types";

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  color = "blue",
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-sm text-green-600 mt-2">{trend}</p>}
        </div>
        <div
          className={`w-12 h-12 ${STAT_COLORS[color]} rounded-lg flex items-center justify-center text-white text-2xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
