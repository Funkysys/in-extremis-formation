// Hook: usePerformanceTracking - Hook pour tracker les performances des composants

import { logger } from "@/services/logger";
import { performanceMonitor } from "@/services/performanceMonitor";
import { useEffect, useRef } from "react";

interface UsePerformanceTrackingOptions {
  componentName: string;
  trackRender?: boolean;
  trackMount?: boolean;
  warnThreshold?: number; // Seuil en ms pour afficher un warning
}

export const usePerformanceTracking = (
  options: UsePerformanceTrackingOptions
) => {
  const {
    componentName,
    trackRender = true,
    trackMount = true,
    warnThreshold = 16,
  } = options;
  const renderCount = useRef(0);
  const mountTime = useRef<number | undefined>(undefined);

  // Track mount time
  useEffect(() => {
    if (trackMount) {
      mountTime.current = performance.now();
      logger.debug(`Component mounted`, componentName);

      return () => {
        if (mountTime.current) {
          const duration = performance.now() - mountTime.current;
          logger.debug(
            `Component unmounted after ${duration.toFixed(2)}ms`,
            componentName
          );
        }
      };
    }
  }, [componentName, trackMount]);

  // Track render time
  useEffect(() => {
    if (trackRender) {
      renderCount.current++;
      const renderStart = performance.now();

      // Mesurer après le render (dans le prochain tick)
      setTimeout(() => {
        const renderDuration = performance.now() - renderStart;

        if (renderDuration > warnThreshold) {
          logger.warn(
            `Slow render detected (${renderDuration.toFixed(2)}ms)`,
            componentName,
            { renderCount: renderCount.current }
          );
        } else {
          logger.debug(
            `Render completed in ${renderDuration.toFixed(2)}ms`,
            componentName,
            { renderCount: renderCount.current }
          );
        }

        performanceMonitor.startMeasure(
          `${componentName} - Render #${renderCount.current}`,
          "component"
        )();
      }, 0);
    }
  });

  return {
    renderCount: renderCount.current,
  };
};
