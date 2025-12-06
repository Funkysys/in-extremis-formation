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
