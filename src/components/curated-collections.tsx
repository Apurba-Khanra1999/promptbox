'use client';

import { useSearch } from './search-provider';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

const featuredCollections = ['Landscapes', 'Portraits', 'Abstract', 'Sci-Fi', 'Fantasy'];

interface CuratedCollectionsProps {
  allTags: string[];
}

export default function CuratedCollections({ allTags }: CuratedCollectionsProps) {
  const { activeFilters, addFilter, removeFilter, clearFilters } = useSearch();

  const toggleFilter = (tag: string) => {
    if (activeFilters.includes(tag)) {
      removeFilter(tag);
    } else {
      addFilter(tag);
    }
  };
  
  const displayTags = [...new Set([...featuredCollections, ...allTags])].sort();

  return (
    <div className="mb-8 md:mb-12 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
      <h3 className="text-xl font-headline font-semibold mb-4 text-center">Explore Collections</h3>
      <div className="flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto">
        {displayTags.map((tag, i) => (
          <Badge
            key={tag}
            variant={activeFilters.includes(tag) ? 'default' : 'secondary'}
            onClick={() => toggleFilter(tag)}
            className="cursor-pointer transition-all duration-200 text-xs md:text-sm py-1.5 md:py-2 px-3 md:px-4 hover:shadow-md hover:-translate-y-0.5"
            role="button"
            aria-pressed={activeFilters.includes(tag)}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFilter(tag)}
            style={{ animation: `slide-in-up 0.5s ease-out ${300 + i * 50}ms backwards` }}
          >
            {tag}
          </Badge>
        ))}
        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="text-muted-foreground hover:text-foreground h-auto py-1.5 md:py-2 px-2 md:px-3 text-xs md:text-sm"
            style={{ animation: 'fade-in 0.5s ease-out 1s backwards' }}
          >
            <X className="mr-1 h-3 w-3 md:h-4 md:w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
