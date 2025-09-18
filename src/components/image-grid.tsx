'use client';
import { useState, useMemo } from 'react';
import ImageCard from './image-card';
import ImageDetailView from './image-detail-view';
import CuratedCollections from './curated-collections';
import { useSearch } from './search-provider';
import type { EnrichedImage } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import Link from 'next/link';
import { Button } from './ui/button';

interface ImageGridProps {
  images: EnrichedImage[];
  favoritesOnly?: boolean;
}

export default function ImageGrid({ images, favoritesOnly = false }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<EnrichedImage | null>(null);
  const { searchTerm, activeFilters } = useSearch();
  const { favorites, isInitialized } = useFavorites();

  const filteredImages = useMemo(() => {
    let currentImages = images;
    
    if (favoritesOnly) {
      if (!isInitialized) return []; // Wait for favorites to load from localStorage
      const favoriteSet = new Set(favorites);
      currentImages = images.filter(img => favoriteSet.has(img.id));
    }
    
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    return currentImages.filter(image => {
      const promptText = image.prompt.toLowerCase();
      const searchMatch = lowercasedSearchTerm === '' || promptText.includes(lowercasedSearchTerm);
      
      const allImageTags = [
        ...image.styles,
        ...image.mediums,
        ...image.movements
      ].map(t => t.toLowerCase());

      const filterMatch = activeFilters.length === 0 || activeFilters.some(filter => {
        const lowercasedFilter = filter.toLowerCase();
        return promptText.includes(lowercasedFilter) || allImageTags.some(tag => tag.includes(lowercasedFilter));
      });

      return searchMatch && filterMatch;
    });
  }, [images, searchTerm, activeFilters, favoritesOnly, favorites, isInitialized]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    images.forEach(img => {
      img.styles.forEach(s => tags.add(s));
      img.mediums.forEach(m => tags.add(m));
      img.movements.forEach(mv => tags.add(mv));
    });
    return Array.from(tags).sort();
  }, [images]);

  const handleImageClick = (image: EnrichedImage) => {
    setSelectedImage(image);
  };

  const handleCloseDetailView = () => {
    setSelectedImage(null);
  };
  
  if (favoritesOnly && !isInitialized) {
      return (
        <div className="container py-8 text-center text-muted-foreground">Loading favorites...</div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {!favoritesOnly && <CuratedCollections allTags={allTags} />}
      
      {filteredImages.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {filteredImages.map((image, i) => (
            <div key={image.id} className="break-inside-avoid">
              <ImageCard 
                image={image} 
                onImageClick={handleImageClick}
                style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <h2 className="text-2xl font-semibold font-headline mb-2">
            {favoritesOnly ? 'No Favorites Yet' : 'No Results Found'}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {favoritesOnly ? 'Start exploring the gallery and add some images to your favorites to see them here.' : 'Try adjusting your search or filters to find what you\'re looking for.'}
          </p>
          {favoritesOnly && (
            <Button asChild className="mt-4">
              <Link href="/">Explore Gallery</Link>
            </Button>
          )}
        </div>
      )}

      <ImageDetailView
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={handleCloseDetailView}
      />
    </div>
  );
}
