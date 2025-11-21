"use client";

import { PaymentsFilters } from "@/components/admin/payments/PaymentsFilters";
import { PaymentsStats } from "@/components/admin/payments/PaymentsStats";
import { PaymentsTable } from "@/components/admin/payments/PaymentsTable";
import { AdminHeader } from "@/components/admin/shared/AdminHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { usePaymentsData } from "@/hooks/admin/usePaymentsData";

export default function PaymentsManagementPage() {
  const { isLoading, isAdmin } = useAdminAuth();
  const {
    filteredPayments,
    usersMap,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  } = usePaymentsData();

  if (isLoading || !isAdmin) return <LoadingSpinner />;

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          title="Gestion des Paiements"
          description={`${filteredPayments.length} paiement${
            filteredPayments.length > 1 ? "s" : ""
          } trouvé${filteredPayments.length > 1 ? "s" : ""}`}
        />

        <PaymentsStats
          totalPayments={stats.totalPayments}
          paidCount={stats.paidCount}
          pendingCount={stats.pendingCount}
          totalAmount={stats.totalAmount}
        />

        <PaymentsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <EmptyState message="Aucun paiement trouvé" />
        ) : (
          <PaymentsTable payments={filteredPayments} usersMap={usersMap} />
        )}
      </div>
    </div>
  );
}
