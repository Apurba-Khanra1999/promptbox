import ImageForm from '@/components/admin/image-form';
import { getEnrichedImages, getAllCollections } from '@/lib/data';

export default async function EditImagePage({ params }: { params: { id: string } }) {
  const images = await getEnrichedImages();
  const image = images.find(img => img.id === params.id);
  const collections = await getAllCollections();
  
  if (!image) {
    return <div>Image not found</div>;
  }

  return <ImageForm image={image} collections={collections} />;
}
