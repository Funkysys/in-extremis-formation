"use client";

import { useRoleManagement } from "@/hooks/admin/useRoleManagement";
import { NotificationBanner } from "./shared/NotificationBanner";
import { UserRoleRow } from "./shared/UserRoleRow";

export default function RoleList() {
  const {
    users,
    roles,
    loading,
    error,
    selectedRoles,
    saving,
    errorMsg,
    successMsg,
    setSelectedRoles,
    setError,
    setSuccess,
    handleSave,
  } = useRoleManagement();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <span className="animate-spin text-2xl">⏳</span> Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded relative mb-4 flex items-center gap-2">
        <span className="text-lg">❌</span>
        <span>Erreur lors du chargement des données : {error.message}</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {errorMsg && (
        <NotificationBanner
          type="error"
          message={errorMsg}
          onClose={() => setError(null)}
        />
      )}
      {successMsg && (
        <NotificationBanner
          type="success"
          message={successMsg}
          onClose={() => setSuccess(null)}
        />
      )}

      <table className="table w-full">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Rôles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const userRoles =
              selectedRoles[user.id] || (user.role ? [user.role] : []);
            return (
              <UserRoleRow
                key={user.id}
                user={user}
                roles={roles}
                selectedRoles={userRoles}
                saving={saving === user.id}
                onRoleRemove={(roleName) => {
                  const next = userRoles.filter((r) => r !== roleName);
                  setSelectedRoles((prev) => ({ ...prev, [user.id]: next }));
                }}
                onRoleAdd={(roleName) => {
                  let next = [...userRoles, roleName];
                  if (roleName === "superadmin" && !next.includes("admin")) {
                    next = [...next, "admin"];
                  }
                  setSelectedRoles((prev) => ({ ...prev, [user.id]: next }));
                }}
                onSave={() => handleSave(user.id)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
