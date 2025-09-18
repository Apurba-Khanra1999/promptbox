import { getEnrichedImages } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function AdminImagesPage() {
  const images = await getEnrichedImages();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Images</CardTitle>
        <Button asChild>
          <Link href="/admin/images/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Image
          </Link>
        </Button>
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
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
