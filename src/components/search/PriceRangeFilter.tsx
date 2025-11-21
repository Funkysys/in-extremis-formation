"use client";

interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onChange: (type: "min" | "max", value: string) => void;
}

export default function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Prix (€)
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          value={minPrice || ""}
          onChange={(e) => onChange("min", e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
          min="0"
        />
        <span className="text-slate-500">-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice || ""}
          onChange={(e) => onChange("max", e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
          min="0"
        />
      </div>
    </div>
  );
}
