// Configuration: Apollo Client - Optimisations cache avancées

import { InMemoryCache, type TypePolicy } from "@apollo/client";

/**
 * Configuration cache Apollo avec optimisations
 */

// Type policies pour améliorer le cache
const typePolicies: Record<string, TypePolicy> = {
  Query: {
    fields: {
      // Pagination avec merge
      videos: {
        keyArgs: ["filters"], // Cache séparé par filtres
        merge(existing = { videos: [], total: 0 }, incoming) {
          return {
            ...incoming,
            videos: [...(existing.videos || []), ...incoming.videos],
          };
        },
      },
      courses: {
        keyArgs: ["filters"],
        merge(existing = { courses: [], total: 0 }, incoming) {
          return {
            ...incoming,
            courses: [...(existing.courses || []), ...incoming.courses],
          };
        },
      },
      users: {
        keyArgs: ["role"],
        merge(existing = { users: [], total: 0 }, incoming) {
          return {
            ...incoming,
            users: [...(existing.users || []), ...incoming.users],
          };
        },
      },
    },
  },
  User: {
    fields: {
      // Normaliser les champs calculés
      fullName: {
        read(_, { readField }) {
          const firstName = readField<string>("firstName");
          const lastName = readField<string>("lastName");
          return `${firstName || ""} ${lastName || ""}`.trim();
        },
      },
    },
  },
  Video: {
    fields: {
      // Cache local pour le statut de lecture
      isWatched: {
        read(existing) {
          return existing ?? false;
        },
      },
      // Temps de visionnage local
      watchTime: {
        read(existing) {
          return existing ?? 0;
        },
      },
    },
  },
  Course: {
    fields: {
      // Progression calculée
      progress: {
        read(_, { readField }) {
          const completedChapters = readField<number>("completedChapters") ?? 0;
          const totalChapters = readField<number>("totalChapters") ?? 1;
          return (completedChapters / totalChapters) * 100;
        },
      },
    },
  },
};

// Configuration du cache
export const cacheConfig = new InMemoryCache({
  typePolicies,
  possibleTypes: {
    // Définir les types possibles pour les unions/interfaces
    // Ex: Node: ['User', 'Video', 'Course']
  },
});

/**
 * Stratégies de fetch policy:
 *
 * 1. cache-first (défaut):
 *    - Utilise le cache si disponible
 *    - Pour données statiques (profil user, config)
 *
 * 2. cache-and-network:
 *    - Retourne le cache immédiatement
 *    - Puis fetch en background
 *    - Pour données qui changent (feed, notifications)
 *
 * 3. network-only:
 *    - Toujours fetch le serveur
 *    - Pour données critiques temps-réel (paiements, auth)
 *
 * 4. cache-only:
 *    - Utilise uniquement le cache
 *    - Pour données préchargées
 *
 * 5. no-cache:
 *    - Pas de cache du tout
 *    - Pour données sensibles
 */

/**
 * Optimisations cache:
 *
 * 1. Garbage Collection:
 *    - Apollo GC automatique des objets non référencés
 *    - Manual: cache.gc()
 *
 * 2. Evict:
 *    - Supprimer des objets: cache.evict({ id: 'User:123' })
 *    - Vider le cache: cache.evict({ fieldName: 'videos' })
 *
 * 3. Persist:
 *    - Sauvegarder le cache: apollo3-cache-persist
 *    - LocalStorage ou IndexedDB
 *
 * 4. Fragments:
 *    - Utiliser des fragments pour réutiliser les queries
 *    - Améliore le cache hit rate
 */

// Helper pour vider le cache d'une query spécifique
export function evictQuery(cache: InMemoryCache, queryName: string) {
  cache.evict({ fieldName: queryName });
  cache.gc();
}

// Helper pour vider tout le cache
export function clearCache(cache: InMemoryCache) {
  cache.evict({});
  cache.gc();
}

// Helper pour obtenir la taille du cache
export function getCacheSize(cache: InMemoryCache): number {
  return JSON.stringify(cache.extract()).length;
}
