import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CatBreed } from '../data/catBreeds';

const FAVORITES_KEY = '@cat_app_favorites';

interface FavoritesContextType {
  favorites: CatBreed[];
  isLoading: boolean;
  addToFavorites: (breed: CatBreed) => Promise<void>;
  removeFromFavorites: (breedId: string) => Promise<void>;
  toggleFavorite: (breed: CatBreed) => Promise<void>;
  isFavorite: (breedId: string) => boolean;
}

// Create the context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app
export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<CatBreed[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from storage when the provider initializes
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: CatBreed[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites); // This will trigger re-renders in ALL screens using the context
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToFavorites = async (breed: CatBreed) => {
    const newFavorites = [...favorites, breed];
    await saveFavorites(newFavorites);
  };

  const removeFromFavorites = async (breedId: string) => {
    const newFavorites = favorites.filter(breed => breed.id !== breedId);
    await saveFavorites(newFavorites);
  };

  const toggleFavorite = async (breed: CatBreed) => {
    if (isFavorite(breed.id)) {
      await removeFromFavorites(breed.id);
    } else {
      await addToFavorites(breed);
    }
  };

  const isFavorite = (breedId: string): boolean => {
    return favorites.some(breed => breed.id === breedId);
  };

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};