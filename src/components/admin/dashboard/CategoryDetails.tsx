// Composant: CategoryDetails - Détails par catégorie (Users, Videos, Payments)

import { DashboardStats } from "@/lib/admin/types";
import { CategoryCard } from "./CategoryCard";
import { ConversionRates } from "./ConversionRates";

interface CategoryDetailsProps {
  stats: DashboardStats;
}

export const CategoryDetails = ({ stats }: CategoryDetailsProps) => {
  const {
    totalUsers,
    activeUsers,
    premiumUsers,
    totalVideos,
    publishedVideos,
    premiumVideos,
    totalPayments,
    successfulPayments,
    totalRevenue,
  } = stats;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <CategoryCard
        title="Utilisateurs"
        icon="👥"
        items={[
          { label: "Total", value: totalUsers },
          { label: "Actifs", value: activeUsers, color: "green" },
          { label: "Premium", value: premiumUsers, color: "orange" },
          { label: "Inactifs", value: totalUsers - activeUsers, color: "red" },
        ]}
      />

      <CategoryCard
        title="Vidéos"
        icon="🎥"
        items={[
          { label: "Total", value: totalVideos },
          { label: "Publiées", value: publishedVideos, color: "green" },
          { label: "Premium", value: premiumVideos, color: "orange" },
          {
            label: "Brouillons",
            value: totalVideos - publishedVideos,
            color: "gray",
          },
        ]}
      />

      <CategoryCard
        title="Paiements"
        icon="💰"
        items={[
          { label: "Total transactions", value: totalPayments },
          { label: "Réussis", value: successfulPayments, color: "green" },
          {
            label: "Revenu total",
            value: `${totalRevenue.toFixed(2)}€`,
            color: "green",
          },
          {
            label: "Revenu moyen",
            value:
              successfulPayments > 0
                ? `${(totalRevenue / successfulPayments).toFixed(2)}€`
                : "0€",
            color: "blue",
          },
        ]}
      />

      <ConversionRates stats={stats} />
    </div>
  );
};
