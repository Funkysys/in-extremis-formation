"use client";

import { useState } from "react";
import FilterCheckboxGroup from "./FilterCheckboxGroup";
import SortSelect from "./SortSelect";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_LEVELS,
  FilterOption,
  FilterState,
  SORT_OPTIONS,
} from "./filter-constants";

interface SearchFiltersProps {
  categories?: FilterOption[];
  levels?: FilterOption[];
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
  className?: string;
}

export default function SearchFilters({
  categories = DEFAULT_CATEGORIES,
  levels = DEFAULT_LEVELS,
  onFilterChange,
  activeFilters,
  className = "",
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...activeFilters,
      category: activeFilters.category === category ? undefined : category,
    });
  };

  const handleLevelChange = (level: string) => {
    onFilterChange({
      ...activeFilters,
      level: activeFilters.level === level ? undefined : level,
    });
  };

  // const handlePriceChange = (type: "min" | "max", value: string) => {
  //   const numValue = value ? parseFloat(value) : undefined;
  //   onFilterChange({
  //     ...activeFilters,
  //     [type === "min" ? "minPrice" : "maxPrice"]: numValue,
  //   });
  // };

  const handleSortChange = (sortBy: string) => {
    onFilterChange({
      ...activeFilters,
      sortBy,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-800 dark:text-white">
            Filtres
          </h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Réinitialiser
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded lg:hidden hover:bg-slate-100 dark:hover:bg-gray-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transform transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters content */}
      <div className={`space-y-6 ${isExpanded ? "block" : "hidden lg:block"}`}>
        <SortSelect
          value={activeFilters.sortBy || "relevance"}
          options={SORT_OPTIONS}
          onChange={handleSortChange}
        />

        <FilterCheckboxGroup
          title="Catégorie"
          options={categories}
          activeValue={activeFilters.category}
          onChange={handleCategoryChange}
        />

        <FilterCheckboxGroup
          title="Niveau"
          options={levels}
          activeValue={activeFilters.level}
          onChange={handleLevelChange}
        />

        {/* <PriceRangeFilter
          minPrice={activeFilters.minPrice}
          maxPrice={activeFilters.maxPrice}
          onChange={handlePriceChange}
        /> */}
      </div>
    </div>
  );
}
