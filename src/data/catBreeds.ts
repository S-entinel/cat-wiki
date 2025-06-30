export interface CatBreed {
    id: string;
    name: string;
    origin: string;
    temperament: string;
    lifespan: string;
    description: string;
    image: string;
  }
  
  export const catBreeds: CatBreed[] = [
    {
      id: '1',
      name: 'Persian',
      origin: 'Iran',
      temperament: 'Calm, gentle, sweet',
      lifespan: '12-17 years',
      description: 'Known for their long, luxurious coat and sweet personality.',
      image: '🐱'
    },
    {
      id: '2',
      name: 'Maine Coon',
      origin: 'United States',
      temperament: 'Friendly, intelligent, playful',
      lifespan: '13-14 years',
      description: 'Large, gentle giants with tufted ears and bushy tails.',
      image: '🦁'
    },
    {
      id: '3',
      name: 'Siamese',
      origin: 'Thailand',
      temperament: 'Active, vocal, social',
      lifespan: '15-20 years',
      description: 'Elegant cats known for their distinctive color points and blue eyes.',
      image: '🐾'
    },
  ];