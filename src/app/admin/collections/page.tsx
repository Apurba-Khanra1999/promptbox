import { getEnrichedImages } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default async function AdminCollectionsPage() {
  const images = await getEnrichedImages();
  const allTags = new Set<string>();
  const tagCounts: Record<string, number> = {};

  images.forEach(img => {
    const tags = [...img.styles, ...img.mediums, ...img.movements];
    tags.forEach(tag => {
      allTags.add(tag);
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Array.from(allTags).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collection Name</TableHead>
              <TableHead>Image Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTags.map((tag) => (
              <TableRow key={tag}>
                <TableCell>
                  <Badge variant="default">{tag}</Badge>
                </TableCell>
                <TableCell>{tagCounts[tag]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
