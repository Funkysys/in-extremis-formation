"use client";

import { CategoryDetails } from "@/components/admin/dashboard/CategoryDetails";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { QuickNavigation } from "@/components/admin/dashboard/QuickNavigation";
import { RecentActivities } from "@/components/admin/dashboard/RecentActivities";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { LIST_PAYMENTS_QUERY } from "@/graphql/queries/payment-queries";
import { USERS_QUERY } from "@/graphql/queries/user-queries";
import { ALL_VIDEOS_QUERY } from "@/graphql/queries/video-queries";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { QUERY_LIMITS } from "@/lib/admin/constants";
import { AdminPayment, AdminUser, AdminVideo } from "@/lib/admin/types";
import { calculateDashboardStats } from "@/lib/admin/utils";
import { useQuery } from "@apollo/client";

export default function AdminDashboard() {
  const { user, isLoading, isAdmin } = useAdminAuth();

  const { data: usersData, loading: usersLoading } = useQuery(USERS_QUERY, {
    variables: { limit: QUERY_LIMITS.default, offset: QUERY_LIMITS.offset },
  });

  const { data: videosData, loading: videosLoading } = useQuery(
    ALL_VIDEOS_QUERY,
    {
      variables: { limit: QUERY_LIMITS.default, offset: QUERY_LIMITS.offset },
    }
  );

  const { data: paymentsData, loading: paymentsLoading } =
    useQuery(LIST_PAYMENTS_QUERY);

  if (isLoading || !isAdmin) return <LoadingSpinner />;

  const users: AdminUser[] = usersData?.users || [];
  const videos: AdminVideo[] = videosData?.allVideos || [];
  const payments: AdminPayment[] = paymentsData?.list_payments || [];

  const stats = calculateDashboardStats(users, videos, payments);
  const loading = usersLoading || videosLoading || paymentsLoading;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord Admin
          </h1>
          <p className="text-gray-600">
            Vue d&apos;ensemble de la plateforme In Extremis Formation
          </p>
        </div>

        <QuickNavigation />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <DashboardStats stats={stats} />
            <CategoryDetails stats={stats} />
            <RecentActivities payments={payments} />
          </>
        )}
      </div>
    </div>
  );
}
