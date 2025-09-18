import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEnrichedImages } from '@/lib/data';

export default async function AdminDashboard() {
  const images = await getEnrichedImages();
  
  const allTags = new Set<string>();
  images.forEach(img => {
    img.styles.forEach(s => allTags.add(s));
    img.mediums.forEach(m => allTags.add(m));
    img.movements.forEach(mv => allTags.add(mv));
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Images</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{images.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{allTags.size}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
