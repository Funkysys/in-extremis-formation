"use client";

import { FilterOption } from "./filter-constants";

interface FilterCheckboxGroupProps {
  title: string;
  options: FilterOption[];
  activeValue?: string;
  onChange: (value: string) => void;
}

export default function FilterCheckboxGroup({
  title,
  options,
  activeValue,
  onChange,
}: FilterCheckboxGroupProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {title}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={activeValue === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
              {option.label}
            </span>
            {option.count !== undefined && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({option.count})
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
