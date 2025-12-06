import { paymentService } from "@/services/paymentService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

type VerificationStatus =
  | "checking"
  | "paid"
  | "failed"
  | "canceled"
  | "expired"
  | "unknown";

interface PaymentData {
  amount: number;
  status: string;
  description?: string;
  created_at?: string;
}

export function usePaymentVerification() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>("checking");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyPayment = useCallback(async () => {
    setStatus("checking");
    const paymentId = searchParams.get("payment_id");

    if (!paymentId) {
      setStatus("unknown");
      setError("ID de paiement manquant");
      return;
    }

    try {
      const response = await paymentService.getPaymentStatus(paymentId);

      if (!response) {
        setStatus("unknown");
        setError("Impossible de vérifier le paiement");
        return;
      }

      setPaymentData({
        amount: response.amount || 0,
        status: response.status,
        description: response.description,
        created_at: response.created_at,
      });

      switch (response.status) {
        case "paid":
          setStatus("paid");
          break;
        case "failed":
          setStatus("failed");
          break;
        case "canceled":
          setStatus("canceled");
          break;
        case "expired":
          setStatus("expired");
          break;
        default:
          setStatus("unknown");
          break;
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      setStatus("unknown");
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }, [searchParams]);

  useEffect(() => {
    verifyPayment();
  }, [searchParams, verifyPayment]);

  return { status, paymentData, error, verifyPayment };
}
