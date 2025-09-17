import type { StyleDiscoveryOutput } from '@/ai/flows/style-discovery-and-filtering';

export type Image = {
  id: string;
  prompt: string;
  imageUrl: string;
  imageHint: string;
  width: number;
  height: number;
};

export type EnrichedImage = Image & StyleDiscoveryOutput;
