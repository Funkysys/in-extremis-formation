// Index: Optimization exports - Export centralisé des optimisations

// Hooks
export { useDebouncedValue } from "./hooks/useDebouncedValue";
export { useOptimisticMutation } from "./hooks/useOptimisticMutation";
export {
  usePrefetch,
  usePrefetchOnHover,
  usePrefetchOnIntersect,
} from "./hooks/usePrefetch";

// Utils
export { bundleAnalyzerConfig } from "./utils/bundleAnalyzer";
export {
  generateSrcSet,
  getBlurDataURL,
  imageSizes,
  priorityImages,
} from "./utils/imageOptimization";

// Config
export { default as nextOptimizations } from "./config/nextOptimizations";
export {
  cacheConfig,
  clearCache,
  evictQuery,
  getCacheSize,
} from "./lib/apolloCacheConfig";
