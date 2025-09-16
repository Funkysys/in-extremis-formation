interface Filters {
  category: string;
  level: string;
  sort: string;
}

interface SearchAndFilterProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  onFilterChange: (filters: Partial<Filters>) => void;
  filters: Filters;
}

const SearchAndFilter = ({
  onSearch,
  onFilterChange,
  filters,
}: SearchAndFilterProps) => {
  return (
    <div className="join text-slate-900 w-full flex justify-center items-center py-4 ">
      <div>
        <div>
          <input
            className="input join-item bg-slate-100 text-slate-900"
            placeholder="Rechercher"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <select
          className="select join-item bg-slate-100 text-slate-900"
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
        >
          <option value="all">Toutes les catégories</option>
          <option value="guitar">Guitare</option>
          <option value="piano">Piano</option>
          <option value="bass">Basse</option>
          <option value="drums">Batterie</option>
        </select>

        <select
          className="select join-item bg-slate-100 text-slate-900"
          value={filters.level}
          onChange={(e) => onFilterChange({ level: e.target.value })}
        >
          <option value="all">Tous les niveaux</option>
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="advanced">Avancé</option>
        </select>

        <select
          className="select join-item bg-slate-100 text-slate-900"
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
        >
          <option value="newest">Plus récent</option>
          <option value="oldest">Plus ancien</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter;
