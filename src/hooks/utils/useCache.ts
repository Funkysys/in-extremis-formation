import { logger } from "@/services/logger";
import { clearCache, formatCacheSize, getCacheSize } from "@/utils/pwaUtils";
import { useCallback, useEffect, useState } from "react";

export function useCache() {
  const [cacheSize, setCacheSize] = useState(0);
  const [formattedSize, setFormattedSize] = useState("0 B");
  const [loading, setLoading] = useState(false);

  const refreshCacheSize = useCallback(async () => {
    setLoading(true);

    try {
      const size = await getCacheSize();
      setCacheSize(size);
      setFormattedSize(formatCacheSize(size));
    } catch (error) {
      logger.error("Erreur récupération taille cache", error, "PWA");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(async () => {
    setLoading(true);

    try {
      const success = await clearCache();

      if (success) {
        setCacheSize(0);
        setFormattedSize("0 B");
        logger.info("Cache vidé", "PWA");
      }

      return success;
    } catch (error) {
      logger.error("Erreur vidage cache", error, "PWA");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCacheSize();
  }, [refreshCacheSize]);

  return {
    cacheSize,
    formattedSize,
    loading,
    refresh: refreshCacheSize,
    clear,
  };
}
