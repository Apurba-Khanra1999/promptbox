
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getEnrichedImages, getAllCollections } from '@/lib/data';
import type { EnrichedImage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Search } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function AdminImagesPage() {
  const [images, setImages] = useState<EnrichedImage[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [fetchedImages, fetchedCollections] = await Promise.all([
        getEnrichedImages(),
        getAllCollections(),
      ]);
      setImages(fetchedImages);
      setCollections(fetchedCollections);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const filteredImages = useMemo(() => {
    return images.filter(image => {
      const searchMatch = image.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      
      const collectionMatch = selectedCollection === 'all' || 
        [...image.styles, ...image.mediums, ...image.movements].includes(selectedCollection);

      return searchMatch && collectionMatch;
    });
  }, [images, searchTerm, selectedCollection]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold font-headline">Manage Images</h1>
        <Button asChild>
          <Link href="/admin/images/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Image
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
           <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {collections.map((collection) => (
                  <SelectItem key={collection} value={collection}>
                    {collection}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Prompt</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading images...
                  </TableCell>
                </TableRow>
              ) : filteredImages.length > 0 ? (
                filteredImages.map((image) => {
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
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/admin/images/edit/${image.id}`}>Edit</Link></DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                 <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No images found for the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
