// Composant: PaymentRow - Ligne de paiement dans le tableau

import { AdminPayment, AdminUser } from "@/lib/admin/types";
import { getPaymentStatusColor } from "@/lib/admin/utils";
import { paymentService } from "@/services/paymentService";

interface PaymentRowProps {
  payment: AdminPayment;
  userInfo?: AdminUser;
}

export const PaymentRow = ({ payment, userInfo }: PaymentRowProps) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 font-mono text-sm text-gray-500 whitespace-nowrap">
        #{payment.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {userInfo?.fullName || "Utilisateur inconnu"}
          </div>
          <div className="text-sm text-gray-500">
            {userInfo?.email || payment.user_id}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="max-w-xs text-sm text-gray-900 truncate">
          {payment.description}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">
          {paymentService.formatAmount(parseFloat(payment.amount))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 uppercase">
          {payment.method || "N/A"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
            payment.status
          )}`}
        >
          {paymentService.getStatusMessage(payment.status)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {new Date(payment.createdAt).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
    </tr>
  );
};
