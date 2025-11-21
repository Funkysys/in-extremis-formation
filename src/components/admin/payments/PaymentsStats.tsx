// Composant: PaymentsStats - Statistiques des paiements

import { StatCard } from "@/components/admin/shared/StatCard";
import { paymentService } from "@/services/paymentService";

interface PaymentsStatsProps {
  totalPayments: number;
  paidCount: number;
  pendingCount: number;
  totalAmount: number;
}

export const PaymentsStats = ({
  totalPayments,
  paidCount,
  pendingCount,
  totalAmount,
}: PaymentsStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
      <StatCard
        title="Total Paiements"
        value={totalPayments}
        icon="💳"
        color="blue"
      />
      <StatCard title="Réussis" value={paidCount} icon="✅" color="green" />
      <StatCard
        title="En attente"
        value={pendingCount}
        icon="⏳"
        color="orange"
      />
      <StatCard
        title="Revenu Total"
        value={paymentService.formatAmount(totalAmount)}
        icon="💰"
        color="green"
      />
    </div>
  );
};
