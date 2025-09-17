import { getEnrichedImages } from '@/lib/data';
import ImageGrid from '@/components/image-grid';

// Revalidate data every hour
export const revalidate = 3600;

export default async function FavoritesPage() {
  const images = await getEnrichedImages();

  return <ImageGrid images={images} favoritesOnly />;
}
