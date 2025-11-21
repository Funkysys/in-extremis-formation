// Composant: PaymentsTable - Tableau complet des paiements

import { AdminPayment, AdminUser } from "@/lib/admin/types";
import { PaymentRow } from "./PaymentRow";

interface PaymentsTableProps {
  payments: AdminPayment[];
  usersMap: Map<string, AdminUser>;
}

export const PaymentsTable = ({ payments, usersMap }: PaymentsTableProps) => {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Montant
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Méthode
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Statut
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                userInfo={usersMap.get(payment.user_id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
