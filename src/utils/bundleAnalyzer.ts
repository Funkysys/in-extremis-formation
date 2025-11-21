// Utility: Bundle Analyzer Config - Configuration pour analyser le bundle

import { logger } from "@/services/logger";

/**
 * Configuration pour analyser la taille du bundle
 *
 * Pour activer l'analyse:
 * 1. Installer: npm install --save-dev @next/bundle-analyzer
 * 2. Décommenter le code dans next.config.ts
 * 3. Lancer: ANALYZE=true npm run build
 */

export const bundleAnalyzerConfig = {
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
  analyzerMode: "static" as const,
  reportFilename: "./analyze/client.html",
  defaultSizes: "gzip" as const,
};

/**
 * Recommendations pour optimiser le bundle:
 *
 * 1. Code Splitting:
 *    - Utiliser dynamic imports: const Component = dynamic(() => import('./Component'))
 *    - Lazy load les routes non-critiques
 *
 * 2. Tree Shaking:
 *    - Import nommé plutôt que default: import { Button } from 'ui'
 *    - Éviter les imports avec side-effects
 *
 * 3. Dependencies:
 *    - Vérifier la taille avec: npm install -g bundle-phobia-cli
 *    - Remplacer lodash par lodash-es (ESM)
 *    - Utiliser moment → date-fns ou dayjs
 *
 * 4. Images:
 *    - Utiliser Next.js Image avec formats WebP/AVIF
 *    - Lazy load images hors viewport
 *
 * 5. Fonts:
 *    - Utiliser next/font pour auto-optimisation
 *    - Subset fonts (ne charger que les caractères utilisés)
 */

// Log bundle size en production
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  // Mesurer le poids JS chargé
  if ("performance" in window && performance.getEntriesByType) {
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];

    const jsSize = resources
      .filter((r) => r.name.includes(".js"))
      .reduce((acc, r) => acc + (r.transferSize || 0), 0);

    const cssSize = resources
      .filter((r) => r.name.includes(".css"))
      .reduce((acc, r) => acc + (r.transferSize || 0), 0);

    logger.info("Bundle size loaded", "Bundle Analyzer", {
      jsSize: `${(jsSize / 1024).toFixed(2)} KB`,
      cssSize: `${(cssSize / 1024).toFixed(2)} KB`,
      total: `${((jsSize + cssSize) / 1024).toFixed(2)} KB`,
    });
  }
}
