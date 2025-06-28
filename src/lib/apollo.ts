import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Configuration pour gérer les types scalaires personnalisés
const typePolicies = {
  Query: {
    fields: {
      videoMarkers: {
        keyArgs: ['videoId'],
        merge(existing: any[] = [], incoming: any[]) {
          return incoming;
        },
      },
    },
  },
};

// Créer un lien HTTP standard
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL + '/graphql',
  credentials: 'include',
});

// Middleware pour ajouter le token d'authentification
const authLink = setContext((_, { headers }) => {
  // Récupérer le token du localStorage uniquement côté client
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }

  // Retourner les headers avec le token d'authentification
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'apollo-require-preflight': 'true',
    },
  };
});

// Lien final
const link = authLink.concat(httpLink);

// Créer le client Apollo
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies,
    possibleTypes: {
      UUID: ['String'],
    },
  }),
  ssrMode: typeof window === 'undefined',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
  },
});

export default client;
