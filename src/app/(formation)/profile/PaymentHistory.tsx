interface Payment {
  id: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
  method?: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
  loading: boolean;
}

export function PaymentHistory({ payments, loading }: PaymentHistoryProps) {
  if (loading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  if (payments.length === 0) {
    return <p className="text-gray-500">Aucun paiement pour le moment</p>;
  }

  return (
    <ul className="space-y-3">
      {payments.map((payment) => (
        <li key={payment.id} className="border-b pb-3">
          <div className="flex justify-between">
            <span>
              <strong>{payment.description}</strong>
            </span>
            <span className="text-green-600 font-semibold">
              {payment.amount} €
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            <span>Méthode: {payment.method}</span> •
            <span>
              {" "}
              {new Date(payment.createdAt).toLocaleDateString("fr-FR")}
            </span>{" "}
            •<span className="capitalize"> {payment.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
