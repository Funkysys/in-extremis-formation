// Service de paiement Mollie
// Basé sur FRONTEND_API_REFERENCE : POST /payments/create, GET /payments/status/{payment_id}

export type {
  PaymentInput,
  PaymentResponse,
  PaymentStatus,
  PaymentStatusType,
} from "./payment/types";

export { createPayment, getPaymentStatus } from "./payment/api";

export {
  formatAmount,
  getCheckoutUrl,
  getStatusMessage,
  isPaymentFailed,
  isPaymentPending,
  isPaymentSuccessful,
} from "./payment/helpers";

import {
  createPayment,
  formatAmount,
  getCheckoutUrl,
  getPaymentStatus,
  getStatusMessage,
  isPaymentFailed,
  isPaymentPending,
  isPaymentSuccessful,
} from "./paymentService";

export class PaymentService {
  createPayment = createPayment;
  getPaymentStatus = getPaymentStatus;
  getCheckoutUrl = getCheckoutUrl;
  isPaymentSuccessful = isPaymentSuccessful;
  isPaymentFailed = isPaymentFailed;
  isPaymentPending = isPaymentPending;
  formatAmount = formatAmount;
  getStatusMessage = getStatusMessage;
}

export const paymentService = new PaymentService();
