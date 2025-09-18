
'use client';

import { useState } from 'react';
import { getEnrichedImages } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// This is a client component, so we fetch data inside a hook or on interaction.
// For this example, we'll simulate the data fetching, but in a real app,
// you might use `useEffect` to fetch data and `useState` to store it.
// The data fetching here is simplified for demonstration purposes.

// Mock data fetching, as server-side `getEnrichedImages` can't be used directly in a client component this way.
// In a real implementation, you would fetch this data via an API route or pass it as props from a server component.
const useMockData = () => {
    const [images, setImages] = useState<any[]>([]);
    const [allTags, setAllTags] = useState<Set<string>>(new Set());
    const [tagCounts, setTagCounts] = useState<Record<string, number>>({});

    // This would be inside a useEffect in a real app
    if (images.length === 0) { // simple guard to prevent re-running
        getEnrichedImages().then(imgs => {
            const tags = new Set<string>();
            const counts: Record<string, number> = {};
            imgs.forEach(img => {
                const imgTags = [...img.styles, ...img.mediums, ...img.movements];
                imgTags.forEach(tag => {
                    tags.add(tag);
                    counts[tag] = (counts[tag] || 0) + 1;
                });
            });
            setImages(imgs);
            setAllTags(tags);
            setTagCounts(counts);
        });
    }

    const sortedTags = Array.from(allTags).sort();

    return { sortedTags, tagCounts };
}


export default function AdminCollectionsPage() {
    const { sortedTags, tagCounts } = useMockData();
    // In a real app, adding a new collection would trigger a state update.
    const [newCollectionName, setNewCollectionName] = useState('');

    const handleAddCollection = () => {
        console.log('Adding collection:', newCollectionName);
        // Here you would typically call an API to create the collection
        // and then update the local state to reflect the change.
        setNewCollectionName('');
    }

  return (
    <div className="space-y-6">
      <AlertDialog>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline">Manage Collections</h1>
          <AlertDialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Collection
            </Button>
          </AlertDialogTrigger>
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
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </AlertDialogTrigger>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
          <AlertDialogTrigger asChild>
            <Card className="flex items-center justify-center border-dashed border-2 hover:border-primary hover:bg-accent transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <PlusCircle className="h-8 w-8" />
                    <span>Add New Collection</span>
                </div>
            </Card>
          </AlertDialogTrigger>
        </div>

        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Add New Collection</AlertDialogTitle>
            <AlertDialogDescription>
                Enter the name for the new collection below. This will be available to assign to images.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="collection-name" className="text-right">
                        Name
                    </Label>
                    <Input 
                        id="collection-name" 
                        placeholder="e.g., 'Abstract Art'" 
                        className="col-span-3"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)} 
                    />
                </div>
            </div>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddCollection} disabled={!newCollectionName}>
                Add Collection
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
