declare module '@/lib/apolloClient' {
  import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
  
  export const getClient: () => ApolloClient<NormalizedCacheObject>;
  export const client: ApolloClient<NormalizedCacheObject>;
}
