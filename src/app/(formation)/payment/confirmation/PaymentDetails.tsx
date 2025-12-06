import { paymentService } from "@/services/paymentService";

interface PaymentDetailsProps {
  amount: number;
  status: string;
  description?: string;
  createdAt?: string;
}

export function PaymentDetails({
  amount,
  status,
  description,
  createdAt,
}: PaymentDetailsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Détails du paiement</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Montant:</span>
          <span className="font-semibold">
            {paymentService.formatAmount(amount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Statut:</span>
          <span className="font-semibold text-green-600">
            {paymentService.getStatusMessage(status)}
          </span>
        </div>
        {description && (
          <div className="flex justify-between">
            <span className="text-gray-600">Description:</span>
            <span className="font-semibold">{description}</span>
          </div>
        )}
        {createdAt && (
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-semibold">
              {new Date(createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
