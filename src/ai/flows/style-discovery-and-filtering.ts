'use server';
/**
 * @fileOverview Identifies visual styles, mediums, and artistic movements from image prompts.
 *
 * - discoverStyles - A function that extracts styles from a given text prompt.
 * - StyleDiscoveryInput - The input type for the discoverStyles function.
 * - StyleDiscoveryOutput - The return type for the discoverStyles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleDiscoveryInputSchema = z.object({
  prompt: z.string().describe('The text prompt associated with the generated image.'),
});
export type StyleDiscoveryInput = z.infer<typeof StyleDiscoveryInputSchema>;

const StyleDiscoveryOutputSchema = z.object({
  styles: z.array(
    z.string().describe('A list of visual styles identified in the prompt.')
  ),
  mediums: z.array(
    z.string().describe('A list of artistic mediums identified in the prompt.')
  ),
  movements: z.array(
    z.string().describe('A list of artistic movements identified in the prompt.')
  ),
});
export type StyleDiscoveryOutput = z.infer<typeof StyleDiscoveryOutputSchema>;

export async function discoverStyles(input: StyleDiscoveryInput): Promise<StyleDiscoveryOutput> {
  return discoverStylesFlow(input);
}

const styleDiscoveryPrompt = ai.definePrompt({
  name: 'styleDiscoveryPrompt',
  input: {schema: StyleDiscoveryInputSchema},
  output: {schema: StyleDiscoveryOutputSchema},
  prompt: `You are an expert art style identifier. Given a text prompt that was used to generate an image, extract the visual styles, artistic mediums, and artistic movements mentioned or implied in the prompt.  Return the results as arrays of strings.

Text Prompt: {{{prompt}}}

Styles:
Mediums:
Movements:`,
});

const discoverStylesFlow = ai.defineFlow(
  {
    name: 'discoverStylesFlow',
    inputSchema: StyleDiscoveryInputSchema,
    outputSchema: StyleDiscoveryOutputSchema,
  },
  async input => {
    const {output} = await styleDiscoveryPrompt(input);
    return output!;
  }
);
