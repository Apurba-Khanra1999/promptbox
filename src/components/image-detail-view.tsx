'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { EnrichedImage } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { useSearch } from './search-provider';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface ImageDetailViewProps {
  image: EnrichedImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageDetailView({ image, isOpen, onClose }: ImageDetailViewProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addFilter } = useSearch();

  if (!image) return null;

  const handleTagClick = (tag: string) => {
    addFilter(tag);
    onClose();
  };

  const allTags = [...new Set([...image.styles, ...image.mediums, ...image.movements])];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 flex flex-col md:flex-row gap-0 border-0">
        <div className="relative w-full md:w-2/3 h-1/2 md:h-full bg-black/80 flex items-center justify-center">
          <Image
            src={image.imageUrl}
            alt={image.prompt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
        <div className="w-full md:w-1/3 h-1/2 md:h-full flex flex-col">
          <ScrollArea className="flex-grow">
            <div className="p-6 space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Prompt Details</DialogTitle>
              </DialogHeader>
            
              <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">Full Prompt</h3>
                <p className="text-muted-foreground leading-relaxed">{image.prompt}</p>
              </div>
              
              {allTags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Discovered Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-primary/20 transition-colors"
                          onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 border-t mt-auto">
             <Button 
              variant="outline"
              size="lg"
              className="w-full text-base"
              onClick={() => toggleFavorite(image.id)}
            >
              <Heart className={cn("mr-2 h-5 w-5 transition-all", isFavorite(image.id) && "fill-destructive text-destructive")} />
              {isFavorite(image.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
