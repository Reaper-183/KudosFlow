// kudos-suggestion.ts
'use server';
/**
 * @fileOverview Provides emoji and keyword suggestions for kudos messages.
 *
 * - getKudosSuggestions - A function that suggests emojis and keywords for a given kudos message.
 * - KudosSuggestionInput - The input type for the getKudosSuggestions function.
 * - KudosSuggestionOutput - The return type for the getKudosSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KudosSuggestionInputSchema = z.object({
  message: z.string().describe('The kudos message to provide suggestions for.'),
});
export type KudosSuggestionInput = z.infer<typeof KudosSuggestionInputSchema>;

const KudosSuggestionOutputSchema = z.object({
  emojis: z.array(z.string()).describe('An array of suggested emojis.'),
  keywords: z.array(z.string()).describe('An array of suggested keywords.'),
});
export type KudosSuggestionOutput = z.infer<typeof KudosSuggestionOutputSchema>;

export async function getKudosSuggestions(input: KudosSuggestionInput): Promise<KudosSuggestionOutput> {
  return kudosSuggestionFlow(input);
}

const kudosSuggestionPrompt = ai.definePrompt({
  name: 'kudosSuggestionPrompt',
  input: {schema: KudosSuggestionInputSchema},
  output: {schema: KudosSuggestionOutputSchema},
  prompt: `You are a helpful assistant that suggests relevant emojis and keywords for a kudos message.

  Given the following kudos message, suggest up to 5 relevant emojis and 5 relevant keywords that could enhance the message.

  Message: {{{message}}}

  Emojis: (List up to 5 relevant emojis)
  Keywords: (List up to 5 relevant keywords)
  `,
});

const kudosSuggestionFlow = ai.defineFlow(
  {
    name: 'kudosSuggestionFlow',
    inputSchema: KudosSuggestionInputSchema,
    outputSchema: KudosSuggestionOutputSchema,
  },
  async input => {
    const {output} = await kudosSuggestionPrompt(input);
    return output!;
  }
);
