import { paymentService } from "@/services/paymentService";
import { PAYMENT_METHODS } from "./PaymentMethodSelector";

interface PaymentSummaryProps {
  amount: number;
  method: string;
}

export function PaymentSummary({ amount, method }: PaymentSummaryProps) {
  const methodName =
    PAYMENT_METHODS.find((pm) => pm.id === method)?.name || method;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-2">Résumé</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Montant:</span>
          <span className="font-semibold">
            {paymentService.formatAmount(amount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Méthode:</span>
          <span className="font-semibold">{methodName}</span>
        </div>
      </div>
    </div>
  );
}
