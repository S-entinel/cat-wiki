// src/types/navigation.ts
import { CatBreed } from './CatBreed';
import { PersonalityProfile, PersonalityScores } from './PersonalityQuiz';

export type RootStackParamList = {
  BreedsList: undefined;
  BreedDetail: {
    breed: CatBreed;
    breedId?: number;
  };
  PersonalityQuiz: undefined;
  QuizResults: {
    personalityType: string;
    scores: PersonalityScores;
    profile: PersonalityProfile;
  };
};

export type RootTabParamList = {
  Home: undefined;
  Breeds: undefined;
  Favorites: undefined;
  Quiz: undefined;
};