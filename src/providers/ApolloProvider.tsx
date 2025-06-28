'use client';

import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo';

export const ApolloProviders = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

// Pour la compatibilité avec le code existant
export default function CustomApolloProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProviders>{children}</ApolloProviders>;
}