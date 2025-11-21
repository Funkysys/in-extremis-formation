"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Locale = "fr" | "en";

const LOCALES: { value: Locale; label: string; flag: string }[] = [
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

interface LanguageSwitcherProps {
  currentLocale?: Locale;
  className?: string;
}

export default function LanguageSwitcher({
  currentLocale = "fr",
  className = "",
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentLang =
    LOCALES.find((l) => l.value === currentLocale) || LOCALES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    // Sauvegarder dans localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }

    // Construire le nouveau chemin
    let newPath = pathname;

    // Retirer l'ancienne locale si présente
    newPath = newPath.replace(/^\/(fr|en)/, "");

    // Ajouter la nouvelle locale (sauf pour fr qui est la locale par défaut)
    if (newLocale !== "fr") {
      newPath = `/${newLocale}${newPath}`;
    }

    // Rediriger
    router.push(newPath || "/");
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
        aria-label="Changer de langue"
      >
        <span className="text-xl">{currentLang.flag}</span>
        <span className="hidden sm:inline text-sm font-medium text-white">
          {currentLang.label}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transform transition-transform text-white ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-slate-200 dark:border-gray-700 z-50 overflow-hidden">
          {LOCALES.map((locale) => (
            <button
              key={locale.value}
              onClick={() => handleLocaleChange(locale.value)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left
                hover:bg-slate-100 dark:hover:bg-gray-700
                transition-colors
                ${
                  locale.value === currentLocale
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }
              `}
            >
              <span className="text-xl">{locale.flag}</span>
              <span
                className={`
                text-sm font-medium
                ${
                  locale.value === currentLocale
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-800 dark:text-white"
                }
              `}
              >
                {locale.label}
              </span>
              {locale.value === currentLocale && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="ml-auto text-blue-600 dark:text-blue-400"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
