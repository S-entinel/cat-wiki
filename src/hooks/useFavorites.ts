import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CatBreed } from '../data/catBreeds';

const FAVORITES_KEY = '@cat_app_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<CatBreed[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from storage when the hook initializes
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
      setFavorites(newFavorites);
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

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
};