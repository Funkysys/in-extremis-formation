// Composant: UserActions - Actions sur un utilisateur

interface UserActionsProps {
  userId: string;
  currentUserId: string;
  isActive: boolean;
  isPremium: boolean;
  isSuperuser: boolean;
  email: string;
  onToggleActive: (userId: string, currentStatus: boolean) => void;
  onTogglePremium: (userId: string, currentStatus: boolean) => void;
  onToggleSuperuser: (userId: string, currentStatus: boolean) => void;
  onDelete: (userId: string, email: string) => void;
}

export const UserActions = ({
  userId,
  currentUserId,
  isActive,
  isPremium,
  isSuperuser,
  email,
  onToggleActive,
  onTogglePremium,
  onToggleSuperuser,
  onDelete,
}: UserActionsProps) => {
  const isCurrentUser = userId === currentUserId;

  return (
    <div className="flex gap-2 justify-end">
      <button
        onClick={() => onToggleActive(userId, isActive)}
        className={`px-3 py-1 rounded ${
          isActive
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }`}
      >
        {isActive ? "Désactiver" : "Activer"}
      </button>
      <button
        onClick={() => onTogglePremium(userId, isPremium)}
        className={`px-3 py-1 rounded ${
          isPremium
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
        }`}
      >
        {isPremium ? "⭐ Premium" : "Premium"}
      </button>
      <button
        onClick={() => onToggleSuperuser(userId, isSuperuser)}
        className={`px-3 py-1 rounded ${
          isSuperuser
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
        }`}
        disabled={isCurrentUser}
      >
        {isSuperuser ? "👑 Admin" : "Admin"}
      </button>
      <button
        onClick={() => onDelete(userId, email)}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        disabled={isCurrentUser}
      >
        🗑️
      </button>
    </div>
  );
};
