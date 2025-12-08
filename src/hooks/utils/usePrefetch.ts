// Hook: usePrefetch - Hook pour précharger des données

import { logger } from "@/services/logger";
import {
  DocumentNode,
  OperationVariables,
  useApolloClient,
} from "@apollo/client";
import { useCallback, useEffect, useRef } from "react";

interface PrefetchOptions {
  query: DocumentNode;
  variables?: OperationVariables;
  delay?: number; // Délai avant prefetch (ms)
  enabled?: boolean; // Activer/désactiver
}

export const usePrefetch = (options: PrefetchOptions) => {
  const { query, variables, delay = 0, enabled = true } = options;
  const client = useApolloClient();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const prefetch = useCallback(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        logger.debug("Prefetching query", "usePrefetch", { variables });

        await client.query({
          query,
          variables,
          fetchPolicy: "network-only", // Force fetch pour mettre en cache
        });

        logger.debug("Prefetch completed", "usePrefetch");
      } catch (error) {
        logger.warn("Prefetch failed", "usePrefetch", { error });
      }
    }, delay);
  }, [client, query, variables, delay, enabled]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { prefetch };
};

// Hook pour prefetch au hover
export const usePrefetchOnHover = (options: PrefetchOptions) => {
  const { prefetch } = usePrefetch({ ...options, enabled: true });

  const handleMouseEnter = useCallback(() => {
    prefetch();
  }, [prefetch]);

  return { onMouseEnter: handleMouseEnter };
};

// Hook pour prefetch au viewport
export const usePrefetchOnIntersect = (options: PrefetchOptions) => {
  const { prefetch } = usePrefetch(options);
  const observerRef = useRef<IntersectionObserver | undefined>(undefined);
  const elementRef = useRef<HTMLElement | undefined>(undefined);

  const setRef = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;

      elementRef.current = element;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              logger.debug(
                "Element in viewport, prefetching",
                "usePrefetchOnIntersect"
              );
              prefetch();
              observerRef.current?.disconnect();
            }
          });
        },
        { rootMargin: "50px" } // Prefetch 50px avant d'entrer dans le viewport
      );

      observerRef.current.observe(element);
    },
    [prefetch]
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { ref: setRef };
};
