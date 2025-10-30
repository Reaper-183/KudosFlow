
'use client';

import { getKudosSuggestions, KudosSuggestionInput } from "@/ai/flows/kudos-suggestion";
import type { Kudos, Comment } from "./types";

// This function is a client-side utility to query the GraphQL API.
async function graphqlQuery(query: string, variables: Record<string, any> = {}) {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // We can pass the mocked user role and ID here for the PoC
      'x-role': 'EMPLOYEE', 
      'x-user-id': 'u1',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    console.error("GraphQL request failed:", res.status, res.statusText);
    const errorBody = await res.text();
    console.error("Error body:", errorBody);
    return null;
  }

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    return null;
  }
  return json.data;
}

export async function sendKudos(input: { recipientId: string; message: string; privacy: 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS' }): Promise<Kudos | null> {
    const query = `
      mutation SendRecognition($input: RecognitionInput!) {
        sendRecognition(input: $input) {
          id
        }
      }
    `;
    const data = await graphqlQuery(query, { input });
    return data?.sendRecognition;
}

export async function likeKudo(id: string): Promise<Kudos | null> {
    const query = `
        mutation LikeRecognition($id: ID!) {
            likeRecognition(id: $id) {
                id
                likes
            }
        }
    `;
    const data = await graphqlQuery(query, { id });
    return data?.likeRecognition;
}

export async function addComment(input: {kudosId: string, message: string}): Promise<Comment | null> {
    const query = `
        mutation AddComment($recognitionId: ID!, $message: String!) {
            addComment(recognitionId: $recognitionId, message: $message) {
                id
            }
        }
    `;
    const data = await graphqlQuery(query, { recognitionId: input.kudosId, message: input.message });
    return data?.addComment;
}


// AI Suggestion function remains a direct call to the Genkit flow
export async function generateSuggestions(input: KudosSuggestionInput) {
    const result = await getKudosSuggestions(input);
    return result;
}
