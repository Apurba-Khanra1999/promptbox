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

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  tags: z.string(), // comma separated
});

type ImageFormValues = z.infer<typeof formSchema>;

interface ImageFormProps {
  image?: EnrichedImage;
}

export default function ImageForm({ image }: ImageFormProps) {
  const allTags = image ? [...image.styles, ...image.mediums, ...image.movements] : [];
  
  const form = useForm<ImageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: image?.prompt || '',
      tags: allTags.join(', '),
    },
  });

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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., fantasy, digital painting, epic" {...field} />
                  </FormControl>
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
