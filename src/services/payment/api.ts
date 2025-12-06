import type { PaymentInput, PaymentResponse, PaymentStatus } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Créer un nouveau paiement Mollie
 */
export async function createPayment(
  input: PaymentInput,
  token?: string
): Promise<PaymentResponse> {
  try {
    const response = await fetch(`${BASE_URL}/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        amount: input.amount,
        description: input.description,
        method: input.method || "ideal",
        redirectUrl:
          input.redirectUrl || `${window.location.origin}/payment/confirmation`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Erreur lors de la création du paiement");
    }

    return await response.json();
  } catch (error) {
    console.error("createPayment error:", error);
    throw error;
  }
}

/**
 * Vérifier le statut d'un paiement
 */
export async function getPaymentStatus(
  paymentId: string,
  token?: string
): Promise<PaymentStatus> {
  try {
    const response = await fetch(`${BASE_URL}/payments/status/${paymentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || "Erreur lors de la récupération du statut"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("getPaymentStatus error:", error);
    throw error;
  }
}
