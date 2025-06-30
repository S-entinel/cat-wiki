import { CatBreed } from '../data/catBreeds';

export type RootStackParamList = {
  BreedsList: undefined;
  BreedDetail: { breed: CatBreed };
};

export type RootTabParamList = {
  Home: undefined;
  Breeds: undefined;
  Favorites: undefined;
};