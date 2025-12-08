// Index: Optimization exports - Export centralisé des optimisations

// Hooks
export { useDebouncedValue } from "./hooks/utils/useDebouncedValue";
export { useOptimisticMutation } from "./hooks/utils/useOptimisticMutation";
export {
  usePrefetch,
  usePrefetchOnHover,
  usePrefetchOnIntersect,
} from "./hooks/utils/usePrefetch";

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
