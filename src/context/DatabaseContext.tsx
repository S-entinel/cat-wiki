import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseService } from '../services/DatabaseService';
import { CatBreed, BreedFilter, BreedSortOptions } from '../types/CatBreed';

interface DatabaseContextType {
  // State
  breeds: CatBreed[];
  favorites: CatBreed[];
  isLoading: boolean;
  error: string | null;

  // Breed operations
  getAllBreeds: () => Promise<void>;
  getBreedById: (id: number) => Promise<CatBreed | null>;
  searchBreeds: (query: string) => Promise<CatBreed[]>;
  filterBreeds: (filter: BreedFilter) => Promise<CatBreed[]>;
  
  // Favorites operations
  getFavorites: () => Promise<void>;
  addToFavorites: (breedId: number) => Promise<void>;
  removeFromFavorites: (breedId: number) => Promise<void>;
  toggleFavorite: (breedId: number) => Promise<void>;
  isFavorite: (breedId: number) => boolean;
  
  // Search history operations
  getSearchHistory: () => Promise<string[]>;
  addToSearchHistory: (query: string) => Promise<void>;
  
  // Utility operations
  getFilterOptions: () => Promise<{
    origins: string[];
    coatLengths: string[];
    activityLevels: string[];
    bodyTypes: string[];
  }>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [breeds, setBreeds] = useState<CatBreed[]>([]);
  const [favorites, setFavorites] = useState<CatBreed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const db = DatabaseService.getInstance();

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Seed database if empty
      await db.seedDatabase();
      
      // Load initial data
      await getAllBreeds();
      await getFavorites();
      
    } catch (err) {
      console.error('Database initialization error:', err);
      setError('Failed to initialize database');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllBreeds = async (): Promise<void> => {
    try {
      const allBreeds = await db.getAllBreeds();
      setBreeds(allBreeds);
    } catch (err) {
      console.error('Error getting all breeds:', err);
      setError('Failed to load breeds');
    }
  };

  const getBreedById = async (id: number): Promise<CatBreed | null> => {
    try {
      return await db.getBreedById(id);
    } catch (err) {
      console.error('Error getting breed by ID:', err);
      setError('Failed to load breed details');
      return null;
    }
  };

  const searchBreeds = async (query: string): Promise<CatBreed[]> => {
    try {
      if (!query.trim()) {
        return breeds;
      }
      return await db.searchBreeds(query);
    } catch (err) {
      console.error('Error searching breeds:', err);
      setError('Failed to search breeds');
      return [];
    }
  };

  const filterBreeds = async (filter: BreedFilter): Promise<CatBreed[]> => {
    try {
      let results = breeds;

      // Apply search query
      if (filter.searchQuery && filter.searchQuery.trim()) {
        results = await db.searchBreeds(filter.searchQuery);
      }

      // Apply additional filters
      if (filter.origin) {
        results = results.filter(breed => breed.origin === filter.origin);
      }

      if (filter.coatLength) {
        results = results.filter(breed => breed.coat_length === filter.coatLength);
      }

      if (filter.bodyType) {
        results = results.filter(breed => breed.body_type === filter.bodyType);
      }

      if (filter.activityLevel) {
        results = results.filter(breed => breed.activity_level === filter.activityLevel);
      }

      if (filter.groomingLevel) {
        results = results.filter(breed => breed.grooming_needs === filter.groomingLevel);
      }

      return results;
    } catch (err) {
      console.error('Error filtering breeds:', err);
      setError('Failed to filter breeds');
      return [];
    }
  };

  const getFavorites = async (): Promise<void> => {
    try {
      const favoriteBreeds = await db.getFavorites();
      setFavorites(favoriteBreeds);
    } catch (err) {
      console.error('Error getting favorites:', err);
      setError('Failed to load favorites');
    }
  };

  const addToFavorites = async (breedId: number): Promise<void> => {
    try {
      await db.addToFavorites(breedId);
      await getFavorites(); // Refresh favorites list
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (breedId: number): Promise<void> => {
    try {
      await db.removeFromFavorites(breedId);
      await getFavorites(); // Refresh favorites list
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Failed to remove from favorites');
    }
  };

  const toggleFavorite = async (breedId: number): Promise<void> => {
    try {
      if (isFavorite(breedId)) {
        await removeFromFavorites(breedId);
      } else {
        await addToFavorites(breedId);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorites');
    }
  };

  const isFavorite = (breedId: number): boolean => {
    return favorites.some(breed => breed.id === breedId);
  };

  const getSearchHistory = async (): Promise<string[]> => {
    try {
      return await db.getSearchHistory();
    } catch (err) {
      console.error('Error getting search history:', err);
      setError('Failed to load search history');
      return [];
    }
  };

  const addToSearchHistory = async (query: string): Promise<void> => {
    try {
      await db.addToSearchHistory(query);
    } catch (err) {
      console.error('Error adding to search history:', err);
      // Don't set error for search history as it's not critical
    }
  };

  const getFilterOptions = async () => {
    try {
      const [origins, coatLengths, activityLevels, bodyTypes] = await Promise.all([
        db.getUniqueOrigins(),
        db.getUniqueCoatLengths(),
        db.getUniqueActivityLevels(),
        db.getUniqueBodyTypes()
      ]);

      return {
        origins,
        coatLengths,
        activityLevels,
        bodyTypes
      };
    } catch (err) {
      console.error('Error getting filter options:', err);
      setError('Failed to load filter options');
      return {
        origins: [],
        coatLengths: [],
        activityLevels: [],
        bodyTypes: []
      };
    }
  };

  const value: DatabaseContextType = {
    // State
    breeds,
    favorites,
    isLoading,
    error,

    // Breed operations
    getAllBreeds,
    getBreedById,
    searchBreeds,
    filterBreeds,

    // Favorites operations
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,

    // Search history operations
    getSearchHistory,
    addToSearchHistory,

    // Utility operations
    getFilterOptions
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Custom hook to use the database context
export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};