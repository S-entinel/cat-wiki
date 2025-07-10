import { catImages } from '../assets/catPhotos/imageMap';


export interface CatBreed {
  id?: number;
  tica_code: string;  // TICA breed code (e.g., "PER" for Persian)
  name: string;
  origin: string;
  coat_length: CoatLength;
  coat_pattern?: string;
  body_type: BodyType;
  temperament: string;
  activity_level: ActivityLevel;
  grooming_needs: GroomingLevel;
  health_issues?: string;
  lifespan_min: number;
  lifespan_max: number;
  weight_min_female: number;  // in kg
  weight_max_female: number;  // in kg
  weight_min_male: number;    // in kg
  weight_max_male: number;    // in kg
  description: string;
  care_requirements?: string;
  ideal_for?: string;
  image_path: string;
  created_at?: string;
  updated_at?: string;
}

export type CoatLength = 
  | 'Hairless'
  | 'Short'
  | 'Medium'
  | 'Long'
  | 'Semi-long';

export type BodyType = 
  | 'Cobby'           // Short, compact, low-legged
  | 'Semi-cobby'      // Slightly longer than cobby
  | 'Semi-foreign'    // Medium build
  | 'Foreign'         // Long, lean, fine-boned
  | 'Oriental';       // Extremely long and lean

export type ActivityLevel = 
  | 'Low'
  | 'Low-Medium'
  | 'Medium'
  | 'Medium-High'
  | 'High';

export type GroomingLevel = 
  | 'Low'
  | 'Low-Medium'
  | 'Medium'
  | 'Medium-High'
  | 'High';

// Helper interfaces for filtering and searching
export interface BreedFilter {
  searchQuery?: string;
  origin?: string;
  coatLength?: CoatLength;
  bodyType?: BodyType;
  activityLevel?: ActivityLevel;
  groomingLevel?: GroomingLevel;
}

export interface BreedSortOptions {
  field: 'name' | 'origin' | 'lifespan_min' | 'weight_min_male' | 'activity_level';
  direction: 'asc' | 'desc';
}

// Utility type for breed creation (without auto-generated fields)
export type CreateCatBreed = Omit<CatBreed, 'id' | 'created_at' | 'updated_at'>;

// Backward compatibility with existing code
export interface LegacyCatBreed {
  id: string;
  name: string;
  origin: string;
  temperament: string;
  lifespan: string;
  description: string;
  image: any;
}

// Conversion utilities
export const convertToLegacyFormat = (breed: CatBreed): LegacyCatBreed => ({
  id: breed.id?.toString() || '0',
  name: breed.name,
  origin: breed.origin,
  temperament: breed.temperament,
  lifespan: `${breed.lifespan_min}-${breed.lifespan_max} years`,
  description: breed.description,
  image: catImages[breed.image_path as keyof typeof catImages] || catImages['placeholder.jpg']
});

export const getLifespanString = (breed: CatBreed): string => {
  return `${breed.lifespan_min}-${breed.lifespan_max} years`;
};

export const getWeightRangeString = (breed: CatBreed, gender?: 'male' | 'female'): string => {
  if (gender === 'male') {
    return `${breed.weight_min_male}-${breed.weight_max_male} kg`;
  } else if (gender === 'female') {
    return `${breed.weight_min_female}-${breed.weight_max_female} kg`;
  } else {
    return `${breed.weight_min_female}-${breed.weight_max_male} kg`;
  }
};