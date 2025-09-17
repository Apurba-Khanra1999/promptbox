'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'aetheria-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(new Set(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error('Error reading favorites from localStorage', error);
    }
    setIsInitialized(true);
  }, []);

  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      setFavorites(newFavorites);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
    } catch (error) {
      console.error('Error saving favorites to localStorage', error);
    }
  };

  const toggleFavorite = useCallback((id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    saveFavorites(newFavorites);
  }, [favorites]);

  const isFavorite = useCallback((id: string) => {
    return favorites.has(id);
  }, [favorites]);

  return { favorites: Array.from(favorites), toggleFavorite, isFavorite, isInitialized };
}
