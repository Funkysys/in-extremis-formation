import { ActionButtons } from "./ActionButtons";
import { PaymentDetails } from "./PaymentDetails";
import { StatusIcon } from "./StatusIcon";

interface StatusDisplayProps {
  status: "checking" | "paid" | "failed" | "canceled" | "expired" | "unknown";
  paymentData: {
    amount: number;
    status: string;
    description?: string;
    created_at?: string;
  } | null;
  error: string | null;
  onRetry: () => void;
}

export function StatusDisplay({
  status,
  paymentData,
  error,
  onRetry,
}: StatusDisplayProps) {
  if (status === "checking") {
    return (
      <div className="text-center py-12">
        <StatusIcon type="loading" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-4">
          Vérification du paiement...
        </h2>
        <p className="text-gray-600">Veuillez patienter</p>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="text-center py-12">
        <StatusIcon type="success" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-4">
          Paiement réussi !
        </h2>
        <p className="text-gray-600 mb-6">
          Votre paiement a été effectué avec succès
        </p>
        {paymentData && (
          <PaymentDetails
            amount={paymentData.amount}
            status={paymentData.status}
            description={paymentData.description}
            createdAt={paymentData.created_at}
          />
        )}
        <ActionButtons variant="success" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-12">
        <StatusIcon type="error" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-4">
          Paiement échoué
        </h2>
        <p className="text-gray-600 mb-6">
          Une erreur est survenue lors du paiement
        </p>
        <ActionButtons variant="retry" onRetry={onRetry} />
      </div>
    );
  }

  if (status === "canceled") {
    return (
      <div className="text-center py-12">
        <StatusIcon type="warning" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-4">
          Paiement annulé
        </h2>
        <p className="text-gray-600 mb-6">Vous avez annulé le paiement</p>
        <ActionButtons variant="retry" onRetry={onRetry} />
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="text-center py-12">
        <StatusIcon type="info" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-4">
          Paiement expiré
        </h2>
        <p className="text-gray-600 mb-6">Le délai de paiement a expiré</p>
        <ActionButtons variant="retry" onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <StatusIcon type="unknown" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-4">
        Statut inconnu
      </h2>
      <p className="text-gray-600 mb-2">
        Impossible de vérifier le statut du paiement
      </p>
      {error && <p className="text-sm text-red-600 mb-6">{error}</p>}
      <ActionButtons variant="unknown" />
    </div>
  );
}
