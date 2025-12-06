"use client";

import { usePayment } from "@/hooks/usePayment";
import { paymentService } from "@/services/paymentService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusDisplay } from "./StatusDisplay";

type VerificationStatus =
  | "checking"
  | "paid"
  | "failed"
  | "canceled"
  | "expired"
  | "unknown";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const { checkPaymentStatus } = usePayment();

  const [status, setStatus] = useState<VerificationStatus>("checking");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const paymentId = searchParams.get("payment_id");

  const verifyPayment = async () => {
    if (!paymentId) {
      setStatus("unknown");
      setError("Aucun ID de paiement trouvé");
      return;
    }

    try {
      const result = await checkPaymentStatus(paymentId);
      setPaymentData({
        amount: result.amount || 0,
        status: result.status || "unknown",
        description: result.description,
        created_at: result.created_at,
      });

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

  useEffect(() => {
    verifyPayment();
  }, [paymentId]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <StatusDisplay
            status={status}
            paymentData={paymentData}
            error={error}
            onRetry={verifyPayment}
          />
        </div>
      </div>
    </div>
  );
}
