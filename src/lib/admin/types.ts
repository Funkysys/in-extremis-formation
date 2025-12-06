// Types communs pour l'administration

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  isSuperuser: boolean;
  is_premium?: boolean;
  createdAt: string;
  role?: string;
}

export interface AdminVideo {
  id: string;
  title: string;
  url: string;
  description?: string;
  duration?: number;
  thumbnailUrl?: string;
  is_published: boolean;
  is_premium: boolean;
  user_id: string;
  createdAt: string;
}

export interface AdminPayment {
  id: string;
  user_id: string;
  amount: string;
  description: string;
  method?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalVideos: number;
  publishedVideos: number;
  premiumVideos: number;
  totalPayments: number;
  successfulPayments: number;
  totalRevenue: number;
}

export type FilterStatus = "all" | "active" | "inactive" | "premium";
export type VideoFilterStatus = "all" | "published" | "unpublished" | "premium";
export type PaymentFilterStatus = "all" | "paid" | "pending" | "failed";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}
