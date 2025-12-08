// Hook personnalisé pour gérer les paiements Mollie

import { CREATE_PAYMENT_MUTATION } from "@/graphql/mutations";
import { useAuth } from "@/providers/AuthProvider";
import {
  PaymentInput,
  PaymentResponse,
  paymentService,
  PaymentStatus,
} from "@/services/paymentService";
import { useMutation } from "@apollo/client";
// import { useRouter } from "next/navigation"; // À utiliser pour redirection
import { useCallback, useState } from "react";

interface UsePaymentReturn {
  createPayment: (input: PaymentInput) => Promise<void>;
  checkPaymentStatus: (paymentId: string) => Promise<PaymentStatus>;
  isProcessing: boolean;
  error: string | null;
  paymentResponse: PaymentResponse | null;
  clearError: () => void;
}

export function usePayment(): UsePaymentReturn {
  const { token } = useAuth();
  // const router = useRouter(); // À utiliser pour redirection après paiement
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResponse, setPaymentResponse] =
    useState<PaymentResponse | null>(null);

  // Mutation GraphQL pour enregistrer le paiement
  const [createPaymentMutation] = useMutation(CREATE_PAYMENT_MUTATION);

  /**
   * Créer un paiement et rediriger vers Mollie
   */
  const createPayment = useCallback(
    async (input: PaymentInput) => {
      setIsProcessing(true);
      setError(null);

      try {
        // 1. Créer le paiement via l'API REST Mollie
        const response = await paymentService.createPayment(
          input,
          token || undefined
        );
        setPaymentResponse(response);

        // 2. Enregistrer le paiement dans la base via GraphQL
        await createPaymentMutation({
          variables: {
            input: {
              amount: input.amount,
              description: input.description,
              method: input.method || "ideal",
            },
          },
        });

        // 3. Rediriger vers la page de paiement Mollie
        const checkoutUrl = paymentService.getCheckoutUrl(response);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          throw new Error("URL de paiement non disponible");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors du paiement";
        setError(errorMessage);
        console.error("Payment error:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [token, createPaymentMutation]
  );

  /**
   * Vérifier le statut d'un paiement
   */
  const checkPaymentStatus = useCallback(
    async (paymentId: string): Promise<PaymentStatus> => {
      setIsProcessing(true);
      setError(null);

      try {
        const status = await paymentService.getPaymentStatus(
          paymentId,
          token || undefined
        );
        return status;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la vérification du statut";
        setError(errorMessage);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [token]
  );

  /**
   * Effacer l'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createPayment,
    checkPaymentStatus,
    isProcessing,
    error,
    paymentResponse,
    clearError,
  };
}
