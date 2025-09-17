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
    <div className="mb-8 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-nowrap">Explore Collections</h3>
      <div className="flex items-center gap-2 flex-wrap">
        {displayTags.map(tag => (
          <Badge
            key={tag}
            variant={activeFilters.includes(tag) ? 'default' : 'secondary'}
            onClick={() => toggleFilter(tag)}
            className="cursor-pointer transition-colors text-sm py-1 px-3"
            role="button"
            aria-pressed={activeFilters.includes(tag)}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFilter(tag)}
          >
            {tag}
          </Badge>
        ))}
        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
