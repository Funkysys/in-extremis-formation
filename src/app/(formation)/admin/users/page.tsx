"use client";

import { AdminHeader } from "@/components/admin/shared/AdminHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { useUsersManagement } from "@/hooks/admin/useUsersManagement";

export default function UsersManagementPage() {
  const { user, isLoading, isAdmin } = useAdminAuth();
  const {
    filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    handleToggleActive,
    handleTogglePremium,
    handleToggleSuperuser,
    handleDelete,
  } = useUsersManagement();

  if (isLoading || !isAdmin) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AdminHeader
          title="Gestion des Utilisateurs"
          description={`${filteredUsers.length} utilisateur${
            filteredUsers.length > 1 ? "s" : ""
          } trouvé${filteredUsers.length > 1 ? "s" : ""}`}
        />

        <UsersFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState message="Aucun utilisateur trouvé" />
        ) : (
          <UsersTable
            users={filteredUsers}
            currentUserId={user?.id || ""}
            onToggleActive={handleToggleActive}
            onTogglePremium={handleTogglePremium}
            onToggleSuperuser={handleToggleSuperuser}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
