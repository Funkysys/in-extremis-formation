interface PaymentMethodSelectorProps {
  method: string;
  onMethodChange: (method: string) => void;
}

const PAYMENT_METHODS = [
  { id: "ideal", name: "iDEAL", icon: "🇳🇱" },
  { id: "creditcard", name: "Carte bancaire", icon: "💳" },
  { id: "bancontact", name: "Bancontact", icon: "🇧🇪" },
  { id: "paypal", name: "PayPal", icon: "💰" },
  { id: "sofort", name: "SOFORT", icon: "🏦" },
];

export function PaymentMethodSelector({
  method,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Méthode de paiement
      </label>
      <div className="grid grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((pm) => (
          <button
            key={pm.id}
            type="button"
            onClick={() => onMethodChange(pm.id)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
              method === pm.id
                ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-xl">{pm.icon}</span>
            <span className="text-sm">{pm.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { PAYMENT_METHODS };
