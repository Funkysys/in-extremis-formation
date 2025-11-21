// Composant: RoleDropdown - Dropdown pour ajouter des rôles

import type { Role } from "@/types";

interface RoleDropdownProps {
  userId: string;
  roles: Role[];
  selectedRoles: string[];
  onAddRole: (roleName: string) => void;
}

export const RoleDropdown = ({
  userId,
  roles,
  selectedRoles,
  onAddRole,
}: RoleDropdownProps) => {
  const availableRoles = roles.filter(
    (role) => !selectedRoles.includes(role.name)
  );

  const toggleDropdown = () => {
    const dropdown = document.getElementById(`dropdown-roles-${userId}`);
    if (dropdown) dropdown.classList.toggle("hidden");
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="ml-2 px-2 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
        tabIndex={0}
        onClick={toggleDropdown}
      >
        + Ajouter
      </button>
      <div
        id={`dropdown-roles-${userId}`}
        className="hidden absolute z-10 mt-1 left-0 w-32 bg-white border border-slate-300 rounded shadow-lg"
      >
        {availableRoles.length === 0 ? (
          <div className="px-2 py-1 text-slate-400 text-xs">
            Aucun rôle à ajouter
          </div>
        ) : (
          availableRoles.map((role) => (
            <button
              key={role.name}
              type="button"
              className="w-full text-left px-2 py-1 hover:bg-amber-100 text-xs text-amber-900"
              onClick={() => {
                onAddRole(role.name);
                toggleDropdown();
              }}
            >
              {role.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
