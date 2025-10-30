
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

let client: ApolloClient<any> | null = null;

export const getClient = () => {
  // Create a new client if there's no existing one
  // or if we are running on the server.
  if (!client || typeof window === 'undefined') {
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    client = new ApolloClient({
      // Use SchemaLink to directly query the schema
      // on the server-side, avoiding a network call.
      link: new SchemaLink({ schema }),
      cache: new InMemoryCache(),
      // This is important for server-side rendering
      ssrMode: typeof window === 'undefined',
    });
  }

  return client;
};
