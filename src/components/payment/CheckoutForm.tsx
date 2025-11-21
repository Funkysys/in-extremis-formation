"use client";

// Formulaire de paiement avec sélection du montant et de la méthode

import { usePayment } from "@/hooks/usePayment";
import { paymentService } from "@/services/paymentService";
import { useState } from "react";

interface CheckoutFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  prefilledAmount?: number;
  prefilledDescription?: string;
}

export function CheckoutForm({
  onSuccess,
  onCancel,
  prefilledAmount,
  prefilledDescription,
}: CheckoutFormProps) {
  const { createPayment, isProcessing, error, clearError } = usePayment();

  const [amount, setAmount] = useState(prefilledAmount || 0);
  const [description, setDescription] = useState(
    prefilledDescription || "Paiement In Extremis Formation"
  );
  const [method, setMethod] = useState<string>("ideal");

  // Montants prédéfinis
  const presetAmounts = [10, 25, 50, 100, 250, 500];

  // Méthodes de paiement disponibles
  const paymentMethods = [
    { id: "ideal", name: "iDEAL", icon: "🇳🇱" },
    { id: "creditcard", name: "Carte bancaire", icon: "💳" },
    { id: "bancontact", name: "Bancontact", icon: "🇧🇪" },
    { id: "paypal", name: "PayPal", icon: "💰" },
    { id: "sofort", name: "SOFORT", icon: "🏦" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      alert("Veuillez saisir un montant valide");
      return;
    }

    try {
      await createPayment({
        amount,
        description,
        method,
      });
      onSuccess?.();
    } catch (err) {
      // L'erreur est déjà gérée par le hook
      console.error("Payment submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
              <button
                type="button"
                onClick={clearError}
                className="text-sm text-red-600 hover:text-red-500 underline mt-1"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Montant */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Montant
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                amount === preset
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {paymentService.formatAmount(preset)}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            €
          </span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount || ""}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Montant personnalisé"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Description du paiement"
        />
      </div>

      {/* Méthode de paiement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Méthode de paiement
        </label>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setMethod(pm.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                method === pm.id
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-xl">{pm.icon}</span>
              <span className="text-sm">{pm.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Résumé */}
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
            <span className="font-semibold">
              {paymentMethods.find((pm) => pm.id === method)?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isProcessing || amount <= 0}
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Traitement...
            </span>
          ) : (
            "Payer maintenant"
          )}
        </button>
      </div>

      {/* Info sécurité */}
      <div className="text-center text-sm text-gray-500">
        <p className="flex items-center justify-center gap-1">
          <svg
            className="h-4 w-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          Paiement sécurisé par Mollie
        </p>
      </div>
    </form>
  );
}
