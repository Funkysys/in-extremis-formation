/**
 * Hooks utilitaires génériques
 */

export { useCache } from "./useCache";
export { useDebouncedValue } from "./useDebouncedValue";
export { useErrorBoundary } from "./useErrorBoundary";
export { useOnlineStatus } from "./useOnlineStatus";
export { useOptimisticMutation } from "./useOptimisticMutation";
export { usePerformanceTracking } from "./usePerformanceTracking";
export { usePrefetch, usePrefetchOnHover } from "./usePrefetch";

// Ré-export depuis ui (pour compatibilité)
export { useShare } from "../ui/useShare";
