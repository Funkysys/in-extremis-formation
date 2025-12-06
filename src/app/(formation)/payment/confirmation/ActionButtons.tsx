import Link from "next/link";

interface ActionButtonsProps {
  variant: "success" | "retry" | "unknown";
  onRetry?: () => void;
}

export function ActionButtons({ variant, onRetry }: ActionButtonsProps) {
  if (variant === "success") {
    return (
      <div className="flex gap-4 justify-center">
        <Link
          href="/profile"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Voir mon profil
        </Link>
        <Link
          href="/formation"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Retour aux formations
        </Link>
      </div>
    );
  }

  if (variant === "retry" && onRetry) {
    return (
      <div className="flex gap-4 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Réessayer
        </button>
        <Link
          href="/formation"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Retour aux formations
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center">
      <Link
        href="/profile"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Voir mon profil
      </Link>
      <Link
        href="/formation"
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Retour aux formations
      </Link>
    </div>
  );
}
