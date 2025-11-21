// Composant: PaymentsFilters - Filtres de recherche et statut

import { PaymentFilterStatus } from "@/lib/admin/types";

interface PaymentsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: PaymentFilterStatus;
  setFilterStatus: (value: PaymentFilterStatus) => void;
}

export const PaymentsFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}: PaymentsFiltersProps) => {
  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Rechercher
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Email, nom ou description..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Filtrer par statut
          </label>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as PaymentFilterStatus)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous</option>
            <option value="paid">Réussis</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoués</option>
          </select>
        </div>
      </div>
    </div>
  );
};
