// Composant: UserRow - Ligne d'utilisateur dans le tableau

import { AdminUser } from "@/lib/admin/types";
import { UserActions } from "./UserActions";

interface UserRowProps {
  user: AdminUser;
  currentUserId: string;
  onToggleActive: (userId: string, currentStatus: boolean) => void;
  onTogglePremium: (userId: string, currentStatus: boolean) => void;
  onToggleSuperuser: (userId: string, currentStatus: boolean) => void;
  onDelete: (userId: string, email: string) => void;
}

export const UserRow = ({
  user,
  currentUserId,
  onToggleActive,
  onTogglePremium,
  onToggleSuperuser,
  onDelete,
}: UserRowProps) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {user.fullName}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            user.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.isActive ? "Actif" : "Inactif"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-2">
          {user.isSuperuser && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              Admin
            </span>
          )}
          {user.is_premium && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
              Premium
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <UserActions
          userId={user.id}
          currentUserId={currentUserId}
          isActive={user.isActive}
          isPremium={user.is_premium || false}
          isSuperuser={user.isSuperuser}
          email={user.email}
          onToggleActive={onToggleActive}
          onTogglePremium={onTogglePremium}
          onToggleSuperuser={onToggleSuperuser}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
};
