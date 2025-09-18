'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { EnrichedImage } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const formSchema = z.object({
  imageUrl: z.string().url('Please enter a valid URL'),
  prompt: z.string().min(1, 'Prompt is required'),
  collections: z.array(z.string()),
});

type ImageFormValues = z.infer<typeof formSchema>;

interface ImageFormProps {
  image?: EnrichedImage;
  collections: string[];
}

export default function ImageForm({ image, collections }: ImageFormProps) {
  const imageCollections = image ? [...image.styles, ...image.mediums, ...image.movements] : [];
  
  const form = useForm<ImageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: image?.imageUrl.startsWith('https://picsum.photos') ? '' : image?.imageUrl || '',
      prompt: image?.prompt || '',
      collections: imageCollections,
    },
  });

  const [open, setOpen] = useState(false);
  const selectedCollections = form.watch('collections') || [];

  const handleCollectionToggle = (collection: string) => {
    const currentCollections = form.getValues('collections') || [];
    const newCollections = currentCollections.includes(collection)
      ? currentCollections.filter((c) => c !== collection)
      : [...currentCollections, collection];
    form.setValue('collections', newCollections, { shouldValidate: true });
  };

  const onSubmit = (data: ImageFormValues) => {
    console.log('Form submitted (no backend action)', data);
    // In a real app, you would handle form submission here.
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{image ? 'Edit Image' : 'Add New Image'}</CardTitle>
        <CardDescription>
          {image ? 'Update the details for this image.' : 'Fill out the form to add a new image to the gallery.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., A city built in the clouds..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collections"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Collections</FormLabel>
                   <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-auto"
                      >
                        <div className="flex gap-1 flex-wrap">
                          {selectedCollections.length > 0 ? (
                            selectedCollections.map((collection) => (
                              <Badge variant="secondary" key={collection}>{collection}</Badge>
                            ))
                          ) : (
                            "Select collections..."
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                       <Command>
                        <CommandInput placeholder="Search collections..." />
                        <CommandList>
                          <CommandEmpty>No collections found.</CommandEmpty>
                          <CommandGroup>
                            {collections.map((collection) => (
                              <CommandItem
                                key={collection}
                                onSelect={() => handleCollectionToggle(collection)}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCollections.includes(collection) ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {collection}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit">{image ? 'Save Changes' : 'Create Image'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
