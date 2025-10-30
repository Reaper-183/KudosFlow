
import { gql } from '@apollo/client';
import { getClient } from './graphql/client';
import { Kudos } from "./types";

// This function is a server-side only utility to query the GraphQL API.
async function graphqlQuery(query: string, variables: Record<string, any> = {}) {
  // Use a reliable environment variable for the app's URL.
  // This needs to be set in Vercel's environment variables settings for production.
  const host = process.env.NEXT_PUBLIC_APP_URL;

  if (!host) {
    // This will provide a clear error in the logs if the variable is not set.
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set.');
  }

  const apiUrl = `${host}/api/graphql`;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // We can pass the mocked user role and ID here for the PoC
        'x-role': 'EMPLOYEE',
        'x-user-id': 'u1',
      },
      body: JSON.stringify({ query, variables }),
      // Ensure we don't cache failed requests and always get fresh data.
      cache: 'no-store', 
    });

    if (!res.ok) {
      console.error("GraphQL request failed:", res.status, res.statusText);
      const errorBody = await res.text();
      console.error("Error body:", errorBody);
      // Return null or an empty object to prevent crashes on the frontend.
      return { data: null, errors: [{ message: `Request failed with status ${res.status}` }] };
    }

    const json = await res.json();
    return json;

  } catch (error) {
    console.error('Fetch to GraphQL API failed:', error);
    return { data: null, errors: [{ message: 'Failed to connect to the API.' }] };
  }
}

export async function getKudos(): Promise<Kudos[] | null> {
    const query = `
      query GetRecognitions {
          recognitions {
              id
              sender {
                  id
                  name
                  avatarUrl
                  team
                  role
              }
              recipient {
                  id
                  name
                  avatarUrl
                  team
                  role
              }
              message
              emojis
              privacy
              timestamp
              likes
              comments {
                  id
                  author {
                      id
                      name
                      avatarUrl
                  }
                  message
                  timestamp
              }
          }
      }
    `;

    const result = await graphqlQuery(query);

    if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        return null;
    }

    return result.data?.recognitions || [];
}
