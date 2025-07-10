import { CatBreed } from './CatBreed';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  BreedsList: undefined;
  BreedDetail: { breed: CatBreed; breedId?: number };
};

export type RootTabParamList = {
  Home: undefined;
  Breeds: NavigatorScreenParams<RootStackParamList>;
  Favorites: undefined;
};