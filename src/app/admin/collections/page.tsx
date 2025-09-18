
'use client';

import { useState, useEffect } from 'react';
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


const useMockData = () => {
    const [images, setImages] = useState<any[]>([]);
    const [allTags, setAllTags] = useState<Set<string>>(new Set());
    const [tagCounts, setTagCounts] = useState<Record<string, number>>({});

    useEffect(() => {
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
    }, []);

    const sortedTags = Array.from(allTags).sort();

    return { sortedTags, tagCounts };
}


export default function AdminCollectionsPage() {
    const { sortedTags, tagCounts } = useMockData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
    const [currentCollectionName, setCurrentCollectionName] = useState('');
    const [inputValue, setInputValue] = useState('');

    const openDialog = (mode: 'add' | 'edit', collectionName: string = '') => {
        setDialogMode(mode);
        setCurrentCollectionName(collectionName);
        setInputValue(collectionName);
        setIsDialogOpen(true);
    };

    const handleConfirmAction = () => {
        if (dialogMode === 'add') {
            console.log('Adding collection:', inputValue);
            // API call to add collection would go here
        } else if (dialogMode === 'edit') {
            console.log(`Editing collection '${currentCollectionName}' to '${inputValue}'`);
            // API call to edit collection would go here
        }
        // Reset and close
        setIsDialogOpen(false);
        setDialogMode(null);
        setCurrentCollectionName('');
        setInputValue('');
    };

    const dialogTitle = dialogMode === 'add' ? 'Add New Collection' : 'Edit Collection';
    const dialogDescription = dialogMode === 'add' 
        ? "Enter the name for the new collection below. This will be available to assign to images."
        : `Rename the collection '${currentCollectionName}'. This will update it for all associated images.`;
    const dialogButtonText = dialogMode === 'add' ? 'Add Collection' : 'Save Changes';


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Manage Collections</h1>
        <Button onClick={() => openDialog('add')}>
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
              <Button variant="outline" size="sm" onClick={() => openDialog('edit', tag)}>
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
        <Card 
            className="flex items-center justify-center border-dashed border-2 hover:border-primary hover:bg-accent transition-colors cursor-pointer"
            onClick={() => openDialog('add')}
        >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <PlusCircle className="h-8 w-8" />
                <span>Add New Collection</span>
            </div>
        </Card>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                  {dialogDescription}
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
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)} 
                      />
                  </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmAction} disabled={!inputValue}>
                    {dialogButtonText}
                </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
