// Composant: DashboardStats - Statistiques principales du dashboard

import { StatCard } from "@/components/admin/shared/StatCard";
import { DashboardStats as Stats } from "@/lib/admin/types";
import { calculateConversionRate } from "@/lib/admin/utils";

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const {
    totalUsers,
    activeUsers,
    premiumUsers,
    totalVideos,
    publishedVideos,
    totalRevenue,
    successfulPayments,
  } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Utilisateurs Totaux"
        value={totalUsers}
        icon="👥"
        trend={`${activeUsers} actifs`}
        color="blue"
      />
      <StatCard
        title="Abonnés Premium"
        value={premiumUsers}
        icon="⭐"
        trend={`${calculateConversionRate(
          premiumUsers,
          totalUsers
        )}% des utilisateurs`}
        color="orange"
      />
      <StatCard
        title="Vidéos Totales"
        value={totalVideos}
        icon="🎥"
        trend={`${publishedVideos} publiées`}
        color="purple"
      />
      <StatCard
        title="Revenu Total"
        value={`${totalRevenue.toFixed(2)}€`}
        icon="💰"
        trend={`${successfulPayments} paiements`}
        color="green"
      />
    </div>
  );
};
