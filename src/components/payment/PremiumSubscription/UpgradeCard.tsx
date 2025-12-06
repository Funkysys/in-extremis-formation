import { UpgradeBadge } from "./Badges";
import { FeatureList } from "./FeatureList";

interface UpgradeCardProps {
  onUpgrade: () => void;
  showUpgradeButton: boolean;
}

export function UpgradeCard({
  onUpgrade,
  showUpgradeButton,
}: UpgradeCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <UpgradeBadge />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Passez au Premium
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Débloquez tous les avantages pour seulement 99,99€/an
          </p>
          <FeatureList variant="upgrade" />
          {showUpgradeButton && (
            <button
              onClick={onUpgrade}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
              Passer au Premium
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
