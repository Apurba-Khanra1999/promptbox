import { getEnrichedImages } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default async function AdminImagesPage() {
  const images = await getEnrichedImages();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Images</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Prompt</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.map((image) => {
              const allTags = [...image.styles, ...image.mediums, ...image.movements];
              return (
                <TableRow key={image.id}>
                  <TableCell>
                    <Image 
                      src={image.imageUrl} 
                      alt={image.prompt} 
                      width={64} 
                      height={64} 
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{image.prompt}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {allTags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                      {allTags.length > 3 && <Badge variant="outline">...</Badge>}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
