"use client";

import { usePayment } from "@/hooks/payments";
import { useState } from "react";
import { AmountSelector } from "./CheckoutForm/AmountSelector";
import { ErrorAlert } from "./CheckoutForm/ErrorAlert";
import { PaymentMethodSelector } from "./CheckoutForm/PaymentMethodSelector";
import { PaymentSummary } from "./CheckoutForm/PaymentSummary";
import { SubmitButtons } from "./CheckoutForm/SubmitButtons";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      alert("Veuillez saisir un montant valide");
      return;
    }

    try {
      await createPayment({ amount, description, method });
      onSuccess?.();
    } catch (err) {
      console.error("Payment submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorAlert error={error} onDismiss={clearError} />}

      <AmountSelector amount={amount} onAmountChange={setAmount} />

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

      <PaymentMethodSelector method={method} onMethodChange={setMethod} />

      <PaymentSummary amount={amount} method={method} />

      <SubmitButtons
        isProcessing={isProcessing}
        isDisabled={isProcessing || amount <= 0}
        onCancel={onCancel}
      />

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
