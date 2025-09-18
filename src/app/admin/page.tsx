
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getEnrichedImages, getAllCollections } from '@/lib/data';
import { useState, useEffect, useMemo } from 'react';
import type { EnrichedImage } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { ArrowRight, Image as ImageIcon, FolderKanban, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

interface CollectionStat {
  name: string;
  imageCount: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Collection</span>
            <span className="font-bold text-muted-foreground">{label}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Images</span>
            <span className="font-bold text-foreground">{payload[0].value}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export default function AdminDashboard() {
  const [images, setImages] = useState<EnrichedImage[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
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

  const { collectionStats, mostPopularCollection, recentImages } = useMemo(() => {
    if (isLoading) {
      return { collectionStats: [], mostPopularCollection: { name: '-', imageCount: 0 }, recentImages: [] };
    }

    const stats: CollectionStat[] = collections.map(collection => {
      const count = images.filter(img => 
        [...img.styles, ...img.mediums, ...img.movements].includes(collection)
      ).length;
      return { name: collection, imageCount: count };
    }).sort((a, b) => b.imageCount - a.imageCount);

    const popular = stats[0] || { name: 'N/A', imageCount: 0 };
    
    // Assuming the last 5 images in the array are the most recent
    const recent = [...images].reverse().slice(0, 5);

    return { collectionStats: stats, mostPopularCollection: popular, recentImages: recent };
  }, [images, collections, isLoading]);


  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 font-headline">Admin Dashboard</h1>
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{images.length}</div>
            <p className="text-xs text-muted-foreground">Managed in the gallery</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collections.length}</div>
            <p className="text-xs text-muted-foreground">Across all images</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular Collection</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{mostPopularCollection.name}</div>
            <p className="text-xs text-muted-foreground">With {mostPopularCollection.imageCount} images</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Collection Distribution</CardTitle>
            <CardDescription>Number of images per collection.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={350}>
              <BarChart data={collectionStats.slice(0, 15)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }} />
                <Bar dataKey="imageCount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Images</CardTitle>
            <CardDescription>The last 5 images added to the gallery.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Collections</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentImages.map(image => (
                    <TableRow key={image.id}>
                      <TableCell>
                        <Image 
                          src={image.imageUrl} 
                          alt={image.prompt} 
                          width={40} 
                          height={40} 
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="truncate max-w-[120px]">{image.prompt}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {[...image.styles, ...image.mediums, ...image.movements].length}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    