import type { PaymentResponse, PaymentStatusType } from "./types";

/**
 * Obtenir l'URL de redirection Mollie
 */
export function getCheckoutUrl(
  paymentResponse: PaymentResponse
): string | null {
  return paymentResponse.checkoutUrl || null;
}

/**
 * Vérifier si un paiement est réussi
 */
export function isPaymentSuccessful(status: PaymentStatusType): boolean {
  return status === "paid";
}

/**
 * Vérifier si un paiement a échoué
 */
export function isPaymentFailed(status: PaymentStatusType): boolean {
  return ["failed", "canceled", "expired"].includes(status);
}

/**
 * Vérifier si un paiement est en attente
 */
export function isPaymentPending(status: PaymentStatusType): boolean {
  return ["open", "pending"].includes(status);
}

/**
 * Formater le montant en euros
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Obtenir le message de statut en français
 */
export function getStatusMessage(status: string): string {
  const messages: Record<string, string> = {
    open: "En attente de paiement",
    pending: "Paiement en cours",
    paid: "Paiement réussi",
    failed: "Paiement échoué",
    canceled: "Paiement annulé",
    expired: "Paiement expiré",
  };

  return messages[status] || "Statut inconnu";
}
