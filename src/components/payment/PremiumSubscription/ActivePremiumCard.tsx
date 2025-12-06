import { PremiumBadge } from "./Badges";
import { FeatureList } from "./FeatureList";

interface ActivePremiumCardProps {
  onManage: () => void;
}

export function ActivePremiumCard({ onManage }: ActivePremiumCardProps) {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <PremiumBadge />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-yellow-900 mb-1">
            Abonnement Premium Actif
          </h3>
          <p className="text-sm text-yellow-800 mb-4">
            Vous bénéficiez de tous les avantages premium :
          </p>
          <FeatureList variant="active" />
          <button
            onClick={onManage}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
          >
            Gérer mon abonnement
          </button>
        </div>
      </div>
    </div>
  );
}
