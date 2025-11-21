// Composant: VideosFilters - Filtres pour les vidéos

import { VideoFilterStatus } from "@/lib/admin/types";

interface VideosFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: VideoFilterStatus;
  setFilterStatus: (value: VideoFilterStatus) => void;
}

export const VideosFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}: VideosFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Titre ou description..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrer par statut
          </label>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as VideoFilterStatus)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes</option>
            <option value="published">Publiées</option>
            <option value="unpublished">Non publiées</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>
    </div>
  );
};
