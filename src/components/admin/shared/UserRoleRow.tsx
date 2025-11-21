// Composant: UserRoleRow - Ligne de tableau pour la gestion des rôles

import type { Role, User } from "@/types";
import { RoleBadge } from "./RoleBadge";
import { RoleDropdown } from "./RoleDropdown";

interface UserRoleRowProps {
  user: User;
  roles: Role[];
  selectedRoles: string[];
  saving: boolean;
  onRoleRemove: (roleName: string) => void;
  onRoleAdd: (roleName: string) => void;
  onSave: () => void;
}

export const UserRoleRow = ({
  user,
  roles,
  selectedRoles,
  saving,
  onRoleRemove,
  onRoleAdd,
  onSave,
}: UserRoleRowProps) => {
  const canRemoveRole = (roleName: string) => {
    return !(roleName === "admin" && selectedRoles.includes("superadmin"));
  };

  return (
    <tr key={user.id}>
      <td>{user.fullName}</td>
      <td>{user.email}</td>
      <td>
        <label className="block lg:sr-only font-semibold mb-1">Rôles</label>
        <div
          className={`flex flex-wrap gap-2 items-center min-h-[3rem] w-full border border-slate-300 rounded-lg bg-slate-50 px-2 py-2 ${
            saving ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {selectedRoles.length === 0 ? (
            <span className="badge bg-slate-200 text-slate-500">
              Aucun rôle
            </span>
          ) : (
            selectedRoles.map((roleName) => (
              <RoleBadge
                key={roleName}
                roleName={roleName}
                canRemove={canRemoveRole(roleName)}
                onRemove={() => onRoleRemove(roleName)}
              />
            ))
          )}
          <RoleDropdown
            userId={user.id}
            roles={roles}
            selectedRoles={selectedRoles}
            onAddRole={onRoleAdd}
          />
        </div>
      </td>
      <td>
        <button
          className="btn btn-sm btn-primary flex items-center gap-2"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <span className="flex items-center gap-1">
              <span className="animate-spin">⏳</span> Enregistrement...
            </span>
          ) : (
            "Enregistrer"
          )}
        </button>
      </td>
    </tr>
  );
};
