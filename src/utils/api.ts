/**
 * Utilitaires pour les appels API
 */

/**
 * Retourne l'URL de l'API en fonction de l'environnement
 */
export const getApiUrl = (): string => {
  // Utiliser la variable d'environnement si elle existe
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return apiUrl;
};

/**
 * Construit une URL complète pour un endpoint API
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiUrl();
  // S'assurer que l'endpoint commence par un slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${formattedEndpoint}`;
};
