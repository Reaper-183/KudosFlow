import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/lib/graphql/schema';
import { resolvers } from '@/lib/graphql/resolvers';
import { NextRequest } from 'next/server';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection for the Apollo Sandbox
});

const handler = startServerAndCreateNextHandler(server, {
    context: async (req: NextRequest) => {
        // Mock role & userId for role-based access from headers
        const role = req.headers.get('x-role') || 'EMPLOYEE';
        const userId = req.headers.get('x-user-id') || 'u1';
        return { role, userId, req };
    },
});

export { handler as GET, handler as POST };
