// Provider: ThemeContext - Context pour partager le thème

"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  isStageContext: boolean;
}

const ThemeContext = createContext<ThemeContextType>({ isStageContext: false });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isStageContext, setIsStageContext] = useState(false);

  useEffect(() => {
    const checkStageContext = () => {
      const isDarkStage = document.body.classList.contains("theme-dark-stage");
      const isLightStage =
        document.body.classList.contains("theme-light-stage");
      setIsStageContext(isDarkStage || isLightStage);
    };

    checkStageContext();

    const observer = new MutationObserver(checkStageContext);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeContext.Provider value={{ isStageContext }}>
      {children}
    </ThemeContext.Provider>
  );
};
