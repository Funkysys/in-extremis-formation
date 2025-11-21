// Service de paiement Mollie
// Basé sur FRONTEND_API_REFERENCE : POST /payments/create, GET /payments/status/{payment_id}

export interface PaymentInput {
  amount: number;
  description: string;
  method?: string;
  redirectUrl?: string;
}

export interface PaymentResponse {
  id: string;
  status: string;
  amount: number;
  description: string;
  method?: string;
  checkoutUrl?: string;
  createdAt: string;
}

export type PaymentStatusType =
  | "open"
  | "pending"
  | "paid"
  | "failed"
  | "canceled"
  | "expired";

export interface PaymentStatus {
  id: string;
  status: PaymentStatusType;
  amount: number;
  description: string;
  created_at?: string;
  paidAt?: string;
  failedAt?: string;
  canceledAt?: string;
  expiredAt?: string;
}

export class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }

  /**
   * Créer un nouveau paiement Mollie
   */
  async createPayment(
    input: PaymentInput,
    token?: string
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          amount: input.amount,
          description: input.description,
          method: input.method || "ideal", // Méthode par défaut
          redirectUrl:
            input.redirectUrl ||
            `${window.location.origin}/payment/confirmation`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.detail || "Erreur lors de la création du paiement"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("PaymentService.createPayment error:", error);
      throw error;
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  async getPaymentStatus(
    paymentId: string,
    token?: string
  ): Promise<PaymentStatus> {
    try {
      const response = await fetch(
        `${this.baseUrl}/payments/status/${paymentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.detail || "Erreur lors de la récupération du statut"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("PaymentService.getPaymentStatus error:", error);
      throw error;
    }
  }

  /**
   * Obtenir l'URL de redirection Mollie
   */
  getCheckoutUrl(paymentResponse: PaymentResponse): string | null {
    return paymentResponse.checkoutUrl || null;
  }

  /**
   * Vérifier si un paiement est réussi
   */
  isPaymentSuccessful(status: PaymentStatusType): boolean {
    return status === "paid";
  }

  /**
   * Vérifier si un paiement a échoué
   */
  isPaymentFailed(status: PaymentStatusType): boolean {
    return ["failed", "canceled", "expired"].includes(status);
  }

  /**
   * Vérifier si un paiement est en attente
   */
  isPaymentPending(status: PaymentStatusType): boolean {
    return ["open", "pending"].includes(status);
  }

  /**
   * Formater le montant en euros
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  /**
   * Obtenir le message de statut en français
   */
  getStatusMessage(status: string): string {
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
}

// Instance singleton
export const paymentService = new PaymentService();
