'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { EnrichedImage } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageCardProps {
  image: EnrichedImage;
  onImageClick: (image: EnrichedImage) => void;
  style?: React.CSSProperties;
}

export default function ImageCard({ image, onImageClick, style }: ImageCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(image.id);
  };
  
  return (
    <div 
      className="group relative block overflow-hidden rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 animate-slide-in-up"
      onClick={() => onImageClick(image)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onImageClick(image)}
      aria-label={`View details for image with prompt: ${image.prompt.substring(0, 50)}...`}
      style={style}
    >
      <Image
        src={image.imageUrl}
        alt={image.prompt}
        width={image.width}
        height={image.height}
        className="object-cover w-full h-auto transition-transform duration-500 ease-in-out group-hover:scale-110"
        data-ai-hint={image.imageHint}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
        aria-hidden="true"
      />
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <p className="text-white text-sm line-clamp-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out delay-100">
            {image.prompt}
        </p>
      </div>

      <Button
          variant="secondary"
          size="icon"
          className="absolute top-3 right-3 h-9 w-9 bg-black/30 hover:bg-black/50 border-white/20 border text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform-gpu scale-90 group-hover:scale-100 delay-100"
          onClick={handleFavoriteClick}
          aria-label={isFavorite(image.id) ? "Remove from favorites" : "Add to favorites"}
      >
          <Heart className={cn("h-5 w-5 transition-colors", isFavorite(image.id) ? 'fill-destructive text-destructive' : 'text-white')} />
      </Button>
    </div>
  );
}
