// Utility: Image Optimization - Helper pour optimiser les images

/**
 * Configuration recommandée pour Next.js Image
 *
 * Dans next.config.ts:
 *
 * images: {
 *   formats: ['image/avif', 'image/webp'],
 *   deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
 *   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
 *   minimumCacheTTL: 60,
 *   domains: ['your-cdn-domain.com'],
 * }
 */

// Sizes presets pour les images courantes
export const imageSizes = {
  thumbnail: "w=128&h=128&fit=crop",
  card: "w=384&h=216&fit=crop",
  hero: "w=1920&h=1080&fit=crop",
  avatar: "w=96&h=96&fit=crop",
  banner: "w=1200&h=300&fit=crop",
} as const;

// Générer srcset pour responsive images
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(", ");
}

// Calculer le blur placeholder
export function getBlurDataURL(width: number = 8, height: number = 8): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb' filter='url(%23b)'/%3E%3C/svg%3E`;
}

// Priority images (LCP candidates)
export const priorityImages = ["hero", "banner", "above-fold"] as const;

/**
 * Guidelines d'optimisation images:
 *
 * 1. Format:
 *    - AVIF > WebP > JPEG/PNG
 *    - Next.js Image auto-sélectionne le meilleur format
 *
 * 2. Taille:
 *    - Toujours spécifier width/height pour éviter CLS
 *    - Utiliser fill pour containers dynamiques
 *
 * 3. Loading:
 *    - priority={true} pour LCP images (hero, above-fold)
 *    - loading="lazy" par défaut pour tout le reste
 *
 * 4. Quality:
 *    - quality={75} par défaut (bon compromis)
 *    - quality={90-100} pour photos importantes
 *    - quality={60-70} pour thumbnails
 *
 * 5. Placeholder:
 *    - placeholder="blur" avec blurDataURL
 *    - Améliore la perception de vitesse
 */
