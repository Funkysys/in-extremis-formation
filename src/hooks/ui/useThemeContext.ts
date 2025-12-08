// Hook: useThemeContext - Détection du contexte thème optimisée

import { useEffect, useState } from "react";

export const useThemeContext = () => {
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

  return isStageContext;
};
