// Composant: RoleBadge - Badge de rôle avec suppression

interface RoleBadgeProps {
  roleName: string;
  canRemove: boolean;
  onRemove: () => void;
}

export const RoleBadge = ({
  roleName,
  canRemove,
  onRemove,
}: RoleBadgeProps) => {
  return (
    <span className="flex items-center gap-1 badge bg-amber-200 text-amber-900 border border-amber-400 px-2 py-1 rounded-full text-xs font-semibold">
      {roleName}
      {canRemove && (
        <button
          type="button"
          className="ml-1 text-amber-900 hover:text-red-700 focus:outline-none"
          aria-label={`Retirer le rôle ${roleName}`}
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </span>
  );
};
