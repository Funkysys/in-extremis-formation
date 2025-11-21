"use client";

// Page de confirmation du paiement après redirection depuis Mollie

import { usePayment } from "@/hooks/usePayment";
import {
  paymentService,
  PaymentStatus as PaymentStatusData,
} from "@/services/paymentService";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type PaymentPageStatus =
  | "checking"
  | "paid"
  | "failed"
  | "canceled"
  | "expired"
  | "unknown";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkPaymentStatus } = usePayment();

  const [status, setStatus] = useState<PaymentPageStatus>("checking");
  const [paymentData, setPaymentData] = useState<PaymentStatusData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Récupération du payment ID depuis l'URL
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (!paymentId) {
      setStatus("unknown");
      setError("Aucun ID de paiement trouvé");
      return;
    }

    // Vérification du statut du paiement
    const verifyPayment = async () => {
      try {
        const result = await checkPaymentStatus(paymentId);
        setPaymentData(result);

        if (paymentService.isPaymentSuccessful(result.status)) {
          setStatus("paid");
        } else if (result.status === "failed") {
          setStatus("failed");
        } else if (result.status === "canceled") {
          setStatus("canceled");
        } else if (result.status === "expired") {
          setStatus("expired");
        } else {
          setStatus("unknown");
        }
      } catch (err) {
        setStatus("unknown");
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la vérification du paiement"
        );
      }
    };

    verifyPayment();
  }, [paymentId, checkPaymentStatus]);

  // Rendu selon le statut
  const renderContent = () => {
    switch (status) {
      case "checking":
        return (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Vérification du paiement...
            </h2>
            <p className="text-gray-600">Veuillez patienter</p>
          </div>
        );

      case "paid":
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Paiement réussi !
            </h2>
            <p className="text-gray-600 mb-6">
              Votre paiement a été effectué avec succès
            </p>

            {paymentData && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Détails du paiement
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant:</span>
                    <span className="font-semibold">
                      {paymentService.formatAmount(paymentData.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className="font-semibold text-green-600">
                      {paymentService.getStatusMessage(paymentData.status)}
                    </span>
                  </div>
                  {paymentData.description && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-semibold">
                        {paymentData.description}
                      </span>
                    </div>
                  )}
                  {paymentData.created_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold">
                        {new Date(paymentData.created_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Link
                href="/profile"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Voir mon profil
              </Link>
              <Link
                href="/formation"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retour aux formations
              </Link>
            </div>
          </div>
        );

      case "failed":
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Paiement échoué
            </h2>
            <p className="text-gray-600 mb-6">
              Une erreur est survenue lors du paiement
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/payment/checkout")}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Réessayer
              </button>
              <Link
                href="/formation"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retour aux formations
              </Link>
            </div>
          </div>
        );

      case "canceled":
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Paiement annulé
            </h2>
            <p className="text-gray-600 mb-6">Vous avez annulé le paiement</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/payment/checkout")}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Réessayer
              </button>
              <Link
                href="/formation"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retour aux formations
              </Link>
            </div>
          </div>
        );

      case "expired":
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Paiement expiré
            </h2>
            <p className="text-gray-600 mb-6">Le délai de paiement a expiré</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/payment/checkout")}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Créer un nouveau paiement
              </button>
              <Link
                href="/formation"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retour aux formations
              </Link>
            </div>
          </div>
        );

      case "unknown":
      default:
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Statut inconnu
            </h2>
            <p className="text-gray-600 mb-2">
              Impossible de vérifier le statut du paiement
            </p>
            {error && <p className="text-sm text-red-600 mb-6">{error}</p>}
            <div className="flex gap-4 justify-center">
              <Link
                href="/profile"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Voir mon profil
              </Link>
              <Link
                href="/formation"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retour aux formations
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
