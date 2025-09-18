
import { getEnrichedImages } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Manage Collections</h1>
        {/* In a real app, this would open a dialog/form to add a new collection */}
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Collection
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedTags.map((tag) => (
          <Card key={tag} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{tag}</span>
                <Badge variant="secondary">{tagCounts[tag]}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                This collection has {tagCounts[tag]} image{tagCounts[tag] !== 1 ? 's' : ''}.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
               {/* In a real app, these buttons would trigger edit/delete functionality */}
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
         <Card className="flex items-center justify-center border-dashed border-2 hover:border-primary hover:bg-accent transition-colors">
            <Button variant="ghost" className="h-full w-full">
                <div className="flex flex-col items-center gap-2">
                    <PlusCircle className="h-8 w-8 text-muted-foreground" />
                    <span className="text-muted-foreground">Add New Collection</span>
                </div>
            </Button>
        </Card>
      </div>
    </div>
  );
}
