"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

type Locale = "fr" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  locale: initialLocale = "fr",
  messages,
}: {
  children: React.ReactNode;
  locale?: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: Record<string, any>;
}) {
  const [localeState, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();
  const locale = localeState;

  // Fonction de traduction simple
  const t = (key: string): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  // Changer la locale et rediriger
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);

    // Sauvegarder dans localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }

    // Rediriger vers la nouvelle locale
    const currentPath = pathname.replace(/^\/(fr|en)/, "");
    const newPath =
      newLocale === "fr" ? currentPath : `/${newLocale}${currentPath}`;
    router.push(newPath || "/");
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
