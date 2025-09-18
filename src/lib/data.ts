import promptboxEnrichedData from '@/lib/aetheria-enriched-data.json';
import type { Image, EnrichedImage } from './types';

const enrichedImagesData: EnrichedImage[] = promptboxEnrichedData.map(item => ({
  ...item,
  imageUrl: `https://picsum.photos/seed/${item.id}/${item.width}/${item.height}`,
}));

export const images: Image[] = enrichedImagesData.map(
  ({ styles, mediums, movements, ...image }) => image
);

export async function getEnrichedImages(): Promise<EnrichedImage[]> {
  // Simulate async operation if needed, but data is now local.
  return Promise.resolve(enrichedImagesData);
}

export async function getAllCollections(): Promise<string[]> {
  const images = await getEnrichedImages();
  const allTags = new Set<string>();
  images.forEach(img => {
    img.styles.forEach(s => allTags.add(s));
    img.mediums.forEach(m => allTags.add(m));
    img.movements.forEach(mv => allTags.add(mv));
  });
  return Array.from(allTags).sort();
}
