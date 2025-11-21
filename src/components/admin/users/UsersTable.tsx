// Composant: UsersTable - Tableau complet des utilisateurs

import { AdminUser } from "@/lib/admin/types";
import { UserRow } from "./UserRow";

interface UsersTableProps {
  users: AdminUser[];
  currentUserId: string;
  onToggleActive: (userId: string, currentStatus: boolean) => void;
  onTogglePremium: (userId: string, currentStatus: boolean) => void;
  onToggleSuperuser: (userId: string, currentStatus: boolean) => void;
  onDelete: (userId: string, email: string) => void;
}

export const UsersTable = ({
  users,
  currentUserId,
  onToggleActive,
  onTogglePremium,
  onToggleSuperuser,
  onDelete,
}: UsersTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Créé le
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                currentUserId={currentUserId}
                onToggleActive={onToggleActive}
                onTogglePremium={onTogglePremium}
                onToggleSuperuser={onToggleSuperuser}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
