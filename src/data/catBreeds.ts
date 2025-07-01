export interface CatBreed {
  id: string;
  name: string;
  origin: string;
  temperament: string;
  lifespan: string;
  description: string;
  image: any;
}

export const catBreeds: CatBreed[] = [
  {
    id: '1',
    name: 'Persian',
    origin: 'Iran',
    temperament: 'Calm, gentle, sweet',
    lifespan: '12-17 years',
    description: 'Known for their long, luxurious coat and sweet personality. Persians are laid-back cats that prefer a serene environment.',
    image: require('../assets/catPhotos/persian.jpg')
  },
  {
    id: '2',
    name: 'Maine Coon',
    origin: 'United States',
    temperament: 'Friendly, intelligent, playful',
    lifespan: '13-14 years',
    description: 'Large, gentle giants with tufted ears and bushy tails. They are known for their dog-like personalities and love of water.',
    image: require('../assets/catPhotos/maine-coon.jpg')
  },
  {
    id: '3',
    name: 'Siamese',
    origin: 'Thailand',
    temperament: 'Active, vocal, social',
    lifespan: '15-20 years',
    description: 'Elegant cats known for their distinctive color points and blue eyes. They are very vocal and form strong bonds with their owners.',
    image: require('../assets/catPhotos/siamese.jpg')
  },
  {
    id: '4',
    name: 'British Shorthair',
    origin: 'United Kingdom',
    temperament: 'Calm, independent, loyal',
    lifespan: '13-16 years',
    description: 'Sturdy cats with round faces and dense coats. They are known for their "Cheshire Cat" smile and easy-going nature.',
    image: require('../assets/catPhotos/british-shorthair.jpg')
  },
  {
    id: '5',
    name: 'Ragdoll',
    origin: 'United States',
    temperament: 'Docile, placid, gentle',
    lifespan: '12-15 years',
    description: 'Large, semi-long haired cats that go limp when picked up, hence the name. They are known for their blue eyes and color-point coat.',
    image: require('../assets/catPhotos/ragdoll.jpg')
  },
  {
    id: '6',
    name: 'Bengal',
    origin: 'United States',
    temperament: 'Active, intelligent, energetic',
    lifespan: '12-16 years',
    description: 'Wild-looking cats with leopard-like spots or marbled patterns. They are highly active and love to climb and play.',
    image: require('../assets/catPhotos/bengal.jpg')
  },
  {
    id: '7',
    name: 'Russian Blue',
    origin: 'Russia',
    temperament: 'Quiet, intelligent, loyal',
    lifespan: '15-18 years',
    description: 'Elegant cats with silvery-blue coats and bright green eyes. They are shy with strangers but devoted to their families.',
    image: require('../assets/catPhotos/russian-blue.jpg')
  },
  {
    id: '8',
    name: 'Scottish Fold',
    origin: 'Scotland',
    temperament: 'Sweet, calm, adaptable',
    lifespan: '11-15 years',
    description: 'Known for their unique folded ears that give them an owl-like appearance. They are gentle and get along well with children and other pets.',
    image: require('../assets/catPhotos/scottish-fold.jpg')
  },
  {
    id: '9',
    name: 'Abyssinian',
    origin: 'Ethiopia',
    temperament: 'Active, intelligent, curious',
    lifespan: '12-15 years',
    description: 'Ancient breed with a ticked coat that gives them a wild appearance. They are extremely active and love to explore high places.',
    image: require('../assets/catPhotos/abyssinian.jpg')
  },
  {
    id: '10',
    name: 'Sphynx',
    origin: 'Canada',
    temperament: 'Energetic, loyal, curious',
    lifespan: '13-15 years',
    description: 'Hairless cats known for their wrinkled skin and large ears. Despite their alien appearance, they are warm, affectionate companions.',
    image: require('../assets/catPhotos/sphynx.jpg')
  },
  {
    id: '11',
    name: 'American Shorthair',
    origin: 'United States',
    temperament: 'Easy-going, calm, friendly',
    lifespan: '13-16 years',
    description: 'Classic American breed known for their round faces and sturdy build. They are excellent family cats with moderate activity levels.',
    image: require('../assets/catPhotos/american-shorthair.jpg')
  },
  {
    id: '12',
    name: 'Norwegian Forest Cat',
    origin: 'Norway',
    temperament: 'Gentle, friendly, independent',
    lifespan: '12-16 years',
    description: 'Large, long-haired cats built for cold climates. They have a waterproof double coat and are excellent climbers.',
    image: require('../assets/catPhotos/norwegian-forest.jpg')
  },
  {
    id: '13',
    name: 'Birman',
    origin: 'France',
    temperament: 'Gentle, quiet, companionable',
    lifespan: '13-15 years',
    description: 'Sacred cats of Burma with color-point coats and white gloves on their paws. They are calm and make excellent lap cats.',
    image: require('../assets/catPhotos/birman.jpg')
  },
  {
    id: '14',
    name: 'Oriental Shorthair',
    origin: 'Thailand',
    temperament: 'Active, vocal, social',
    lifespan: '12-15 years',
    description: 'Sleek, elegant cats related to the Siamese. They come in many colors and patterns and are known for their large ears and slender build.',
    image: require('../assets/catPhotos/oriental-shorthair.jpg')
  },
  {
    id: '15',
    name: 'Burmese',
    origin: 'Myanmar',
    temperament: 'Affectionate, social, playful',
    lifespan: '16-18 years',
    description: 'Compact, muscular cats with golden eyes and silky coats. They are known for their dog-like devotion to their owners.',
    image: require('../assets/catPhotos/burmese.jpg')
  },
  {
    id: '16',
    name: 'Turkish Angora',
    origin: 'Turkey',
    temperament: 'Active, intelligent, graceful',
    lifespan: '12-18 years',
    description: 'Ancient breed with silky, medium-length coats. They are playful and athletic, often enjoying water and interactive games.',
    image: require('../assets/catPhotos/turkish-angora.jpg')
  },
  {
    id: '17',
    name: 'Munchkin',
    origin: 'United States',
    temperament: 'Playful, outgoing, intelligent',
    lifespan: '12-15 years',
    description: 'Known for their short legs, these cats are surprisingly agile. They are friendly and adapt well to families with children.',
    image: require('../assets/catPhotos/munchkin.jpg')
  },
  {
    id: '18',
    name: 'Devon Rex',
    origin: 'United Kingdom',
    temperament: 'Active, mischievous, loyal',
    lifespan: '14-17 years',
    description: 'Pixie-like cats with curly coats and large ears. They are highly social and often called "monkey in cat suits" for their antics.',
    image: require('../assets/catPhotos/devon-rex.jpg')
  },
  {
    id: '19',
    name: 'Exotic Shorthair',
    origin: 'United States',
    temperament: 'Quiet, loyal, easy-going',
    lifespan: '12-14 years',
    description: 'Often called the "lazy man\'s Persian," they have the Persian\'s sweet face but with a short, easy-care coat.',
    image: require('../assets/catPhotos/exotic-shorthair.jpg')
  },
  {
    id: '20',
    name: 'Cornish Rex',
    origin: 'United Kingdom',
    temperament: 'Active, adventurous, affectionate',
    lifespan: '11-15 years',
    description: 'Slender cats with curly coats that feel like velvet. They are extremely active and love to run, jump, and play games.',
    image: require('../assets/catPhotos/cornish-rex.jpg')
  }
];