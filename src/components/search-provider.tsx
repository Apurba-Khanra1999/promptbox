'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  addFilter: (filter: string) => void;
  removeFilter: (filter: string) => void;
  clearFilters: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const addFilter = (filter: string) => {
    setActiveFilters((prev) => [...new Set([...prev, filter])]);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  }

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, activeFilters, setActiveFilters, addFilter, removeFilter, clearFilters }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
