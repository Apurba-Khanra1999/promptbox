import { discoverStyles } from '@/ai/flows/style-discovery-and-filtering';
import aetheriaData from './aetheria-data.json';
import type { Image, EnrichedImage } from './types';

const rawImages: Omit<Image, 'imageUrl'>[] = aetheriaData;

export const images: Image[] = rawImages.map(image => ({
  ...image,
  imageUrl: `https://picsum.photos/seed/${image.id}/${image.width}/${image.height}`,
}));

export async function getEnrichedImages(): Promise<EnrichedImage[]> {
  const enrichedImages = await Promise.all(
    images.map(async (image) => {
      try {
        const styles = await discoverStyles({ prompt: image.prompt });
        return { ...image, ...styles };
      } catch (error) {
        console.error(`Failed to discover styles for image ${image.id}:`, error);
        // Return the image with empty styles if AI call fails
        return { ...image, styles: [], mediums: [], movements: [] };
      }
    })
  );
  return enrichedImages;
}
