export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterState {
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  sortBy?: string;
}

export const SORT_OPTIONS = [
  { value: "relevance", label: "Pertinence" },
  { value: "recent", label: "Plus récents" },
  { value: "popular", label: "Populaires" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

export const DEFAULT_CATEGORIES: FilterOption[] = [
  { value: "guitar", label: "Guitare" },
  { value: "piano", label: "Piano" },
  { value: "drums", label: "Batterie" },
  { value: "bass", label: "Basse" },
  { value: "singing", label: "Chant" },
  { value: "theory", label: "Théorie" },
];

export const DEFAULT_LEVELS: FilterOption[] = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];
