import { paymentService } from "@/services/paymentService";

interface AmountSelectorProps {
  amount: number;
  onAmountChange: (amount: number) => void;
}

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

export function AmountSelector({
  amount,
  onAmountChange,
}: AmountSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Montant
      </label>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onAmountChange(preset)}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              amount === preset
                ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {paymentService.formatAmount(preset)}
          </button>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          €
        </span>
        <input
          type="number"
          min="1"
          step="0.01"
          value={amount || ""}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Montant personnalisé"
        />
      </div>
    </div>
  );
}
