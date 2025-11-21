"use client";

// Page de checkout pour le paiement

import { CheckoutForm } from "@/components/payment/CheckoutForm";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupération des paramètres pré-remplis depuis l'URL
  const prefilledAmount = searchParams.get("amount")
    ? parseFloat(searchParams.get("amount")!)
    : undefined;
  const prefilledDescription = searchParams.get("description") || undefined;

  const handleSuccess = () => {
    // Le hook usePayment redirige automatiquement vers Mollie
    // Cette fonction est appelée juste avant la redirection
    console.log("Payment initiated successfully");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finaliser le paiement
          </h1>
          <p className="text-gray-600">
            Sélectionnez le montant et la méthode de paiement
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <CheckoutForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            prefilledAmount={prefilledAmount}
            prefilledDescription={prefilledDescription}
          />
        </div>

        {/* Info complémentaire */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            En cliquant sur &quot;Payer maintenant&quot;, vous serez redirigé
            vers la plateforme de paiement sécurisée Mollie.
          </p>
        </div>
      </div>
    </div>
  );
}
