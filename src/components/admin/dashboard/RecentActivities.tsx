// Composant: RecentActivities - Dernières activités (paiements)

import { AdminPayment } from "@/lib/admin/types";

interface RecentActivitiesProps {
  payments: AdminPayment[];
}

export const RecentActivities = ({ payments }: RecentActivitiesProps) => {
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        📅 Dernières activités
      </h2>
      <div className="space-y-3">
        {recentPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between py-3 border-b last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div>
                <p className="font-medium text-gray-900">
                  Paiement de {parseFloat(payment.amount).toFixed(2)}€
                </p>
                <p className="text-sm text-gray-500">{payment.description}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(payment.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
