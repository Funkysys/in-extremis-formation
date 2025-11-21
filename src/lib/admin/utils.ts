// Utilitaires pour l'administration

import { AdminPayment, AdminUser, AdminVideo, DashboardStats } from "./types";

export const calculateDashboardStats = (
  users: AdminUser[],
  videos: AdminVideo[],
  payments: AdminPayment[]
): DashboardStats => {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const premiumUsers = users.filter((u) => u.is_premium).length;

  const totalVideos = videos.length;
  const publishedVideos = videos.filter((v) => v.is_published).length;
  const premiumVideos = videos.filter((v) => v.is_premium).length;

  const totalPayments = payments.length;
  const successfulPayments = payments.filter((p) => p.status === "paid").length;
  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return {
    totalUsers,
    activeUsers,
    premiumUsers,
    totalVideos,
    publishedVideos,
    premiumVideos,
    totalPayments,
    successfulPayments,
    totalRevenue,
  };
};

export const formatDuration = (seconds?: number): string => {
  if (!seconds) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
    case "open":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
    case "canceled":
    case "expired":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const calculateConversionRate = (
  numerator: number,
  denominator: number
): string => {
  if (denominator === 0) return "0";
  return ((numerator / denominator) * 100).toFixed(1);
};
