import ImageForm from '@/components/admin/image-form';
import { getAllCollections } from '@/lib/data';

export default async function NewImagePage() {
  const collections = await getAllCollections();
  return <ImageForm collections={collections} />;
}
