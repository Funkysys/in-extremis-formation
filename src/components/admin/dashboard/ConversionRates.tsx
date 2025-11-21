// Composant: ConversionRates - Taux de conversion

import { DashboardStats } from "@/lib/admin/types";
import { DetailRow } from "./DetailRow";

interface ConversionRatesProps {
  stats: DashboardStats;
}

export const ConversionRates = ({ stats }: ConversionRatesProps) => {
  const {
    totalUsers,
    premiumUsers,
    totalPayments,
    successfulPayments,
    totalVideos,
    publishedVideos,
    premiumVideos,
  } = stats;

  const calcRate = (num: number, den: number) =>
    den > 0 ? ((num / den) * 100).toFixed(1) : "0";

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        📊 Taux de conversion
      </h2>
      <div className="space-y-3">
        <DetailRow
          label="Utilisateurs → Premium"
          value={`${calcRate(premiumUsers, totalUsers)}%`}
          color="orange"
        />
        <DetailRow
          label="Paiements réussis"
          value={`${calcRate(successfulPayments, totalPayments)}%`}
          color="green"
        />
        <DetailRow
          label="Vidéos publiées"
          value={`${calcRate(publishedVideos, totalVideos)}%`}
          color="blue"
        />
        <DetailRow
          label="Contenu Premium"
          value={`${calcRate(premiumVideos, totalVideos)}%`}
          color="orange"
        />
      </div>
    </div>
  );
};
