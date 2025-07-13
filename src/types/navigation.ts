import { CatBreed } from './CatBreed';

export type RootStackParamList = {
  BreedsList: undefined;
  BreedDetail: {
    breed: CatBreed;
    breedId?: number;
  };
};

export type RootTabParamList = {
  Home: undefined;
  Breeds: undefined;
  Favorites: undefined;
};