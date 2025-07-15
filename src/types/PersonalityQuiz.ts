export interface QuizQuestion {
    id: string;
    question: string;
    options: QuizOption[];
    category: PersonalityDimension;
  }
  
  export interface QuizOption {
    id: string;
    text: string;
    scores: PersonalityScores;
  }
  
  export interface PersonalityScores {
    energy: number;        // -2 to 2: Calm to Energetic
    social: number;        // -2 to 2: Independent to Social
    routine: number;       // -2 to 2: Flexible to Routine-loving
    attention: number;     // -2 to 2: Low-maintenance to Attention-seeking
    playfulness: number;   // -2 to 2: Serious to Playful
  }
  
  export type PersonalityDimension = 'energy' | 'social' | 'routine' | 'attention' | 'playfulness';
  
  export interface PersonalityProfile {
    type: PersonalityType;
    name: string;
    description: string;
    traits: string[];
    idealBreeds: string[];
    emoji: string;
    color: string;
  }
  
  export type PersonalityType = 
    | 'ENERGETIC_SOCIAL'      // High energy, social, playful
    | 'ENERGETIC_INDEPENDENT' // High energy, independent
    | 'CALM_SOCIAL'           // Calm, social, affectionate
    | 'CALM_INDEPENDENT'      // Calm, independent, low-maintenance
    | 'PLAYFUL_SOCIAL'        // Playful, social, attention-seeking
    | 'PLAYFUL_INDEPENDENT'   // Playful but independent
    | 'GENTLE_SOCIAL'         // Gentle, social, routine-loving
    | 'GENTLE_INDEPENDENT';   // Gentle, independent, flexible
  
  export interface QuizResult {
    personalityType: PersonalityType;
    scores: PersonalityScores;
    matchedBreeds: BreedMatch[];
    profile: PersonalityProfile;
  }
  
  export interface BreedMatch {
    breedName: string;
    ticaCode: string;
    compatibility: number; // 0-100
    matchReason: string;
    traits: string[];
  }
  
  export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'How do you prefer to spend your free time?',
      category: 'energy',
      options: [
        {
          id: 'q1a',
          text: 'Relaxing with a book or movie',
          scores: { energy: -2, social: 0, routine: 1, attention: 0, playfulness: -1 }
        },
        {
          id: 'q1b',
          text: 'Going out and being active',
          scores: { energy: 2, social: 1, routine: -1, attention: 0, playfulness: 1 }
        },
        {
          id: 'q1c',
          text: 'Hanging out with friends',
          scores: { energy: 0, social: 2, routine: 0, attention: 1, playfulness: 0 }
        },
        {
          id: 'q1d',
          text: 'Working on personal projects',
          scores: { energy: 0, social: -1, routine: 0, attention: -1, playfulness: 0 }
        }
      ]
    },
    {
      id: 'q2',
      question: 'In social situations, you tend to:',
      category: 'social',
      options: [
        {
          id: 'q2a',
          text: 'Be the center of attention',
          scores: { energy: 1, social: 2, routine: -1, attention: 2, playfulness: 1 }
        },
        {
          id: 'q2b',
          text: 'Enjoy conversations with a few close friends',
          scores: { energy: 0, social: 1, routine: 1, attention: 0, playfulness: 0 }
        },
        {
          id: 'q2c',
          text: 'Prefer to observe and listen',
          scores: { energy: -1, social: -1, routine: 1, attention: -1, playfulness: -1 }
        },
        {
          id: 'q2d',
          text: 'Leave early to recharge alone',
          scores: { energy: -1, social: -2, routine: 0, attention: -2, playfulness: -1 }
        }
      ]
    },
    {
      id: 'q3',
      question: 'Your ideal daily routine is:',
      category: 'routine',
      options: [
        {
          id: 'q3a',
          text: 'Highly structured with set times for everything',
          scores: { energy: 0, social: 0, routine: 2, attention: 0, playfulness: -1 }
        },
        {
          id: 'q3b',
          text: 'Flexible but with some key anchor points',
          scores: { energy: 0, social: 0, routine: 1, attention: 0, playfulness: 0 }
        },
        {
          id: 'q3c',
          text: 'Spontaneous - go with the flow',
          scores: { energy: 1, social: 0, routine: -2, attention: 0, playfulness: 1 }
        },
        {
          id: 'q3d',
          text: 'Minimal structure, maximum freedom',
          scores: { energy: 0, social: -1, routine: -1, attention: -1, playfulness: 0 }
        }
      ]
    },
    {
      id: 'q4',
      question: 'When you need comfort, you prefer:',
      category: 'attention',
      options: [
        {
          id: 'q4a',
          text: 'Being surrounded by loved ones',
          scores: { energy: 0, social: 2, routine: 0, attention: 2, playfulness: 0 }
        },
        {
          id: 'q4b',
          text: 'One-on-one time with someone special',
          scores: { energy: 0, social: 1, routine: 1, attention: 1, playfulness: 0 }
        },
        {
          id: 'q4c',
          text: 'Being alone to process feelings',
          scores: { energy: -1, social: -2, routine: 0, attention: -2, playfulness: -1 }
        },
        {
          id: 'q4d',
          text: 'Distracting yourself with activities',
          scores: { energy: 1, social: 0, routine: -1, attention: 0, playfulness: 1 }
        }
      ]
    },
    {
      id: 'q5',
      question: 'Your approach to new experiences is:',
      category: 'playfulness',
      options: [
        {
          id: 'q5a',
          text: 'Dive right in with enthusiasm',
          scores: { energy: 2, social: 1, routine: -2, attention: 0, playfulness: 2 }
        },
        {
          id: 'q5b',
          text: 'Cautiously optimistic',
          scores: { energy: 0, social: 0, routine: 0, attention: 0, playfulness: 0 }
        },
        {
          id: 'q5c',
          text: 'Prefer familiar experiences',
          scores: { energy: -1, social: 0, routine: 2, attention: 0, playfulness: -1 }
        },
        {
          id: 'q5d',
          text: 'Avoid unless necessary',
          scores: { energy: -2, social: -1, routine: 1, attention: -1, playfulness: -2 }
        }
      ]
    },
    {
      id: 'q6',
      question: 'Your ideal living space is:',
      category: 'energy',
      options: [
        {
          id: 'q6a',
          text: 'Cozy and quiet',
          scores: { energy: -2, social: -1, routine: 1, attention: 0, playfulness: -1 }
        },
        {
          id: 'q6b',
          text: 'Open and social',
          scores: { energy: 0, social: 2, routine: 0, attention: 1, playfulness: 0 }
        },
        {
          id: 'q6c',
          text: 'Lots of space to move around',
          scores: { energy: 2, social: 0, routine: -1, attention: 0, playfulness: 1 }
        },
        {
          id: 'q6d',
          text: 'Organized and efficient',
          scores: { energy: 0, social: 0, routine: 2, attention: 0, playfulness: 0 }
        }
      ]
    },
    {
      id: 'q7',
      question: 'How do you handle stress?',
      category: 'social',
      options: [
        {
          id: 'q7a',
          text: 'Talk it out with others',
          scores: { energy: 0, social: 2, routine: 0, attention: 1, playfulness: 0 }
        },
        {
          id: 'q7b',
          text: 'Physical activity or exercise',
          scores: { energy: 2, social: 0, routine: -1, attention: 0, playfulness: 1 }
        },
        {
          id: 'q7c',
          text: 'Quiet time alone',
          scores: { energy: -1, social: -2, routine: 1, attention: -1, playfulness: -1 }
        },
        {
          id: 'q7d',
          text: 'Stick to my usual routine',
          scores: { energy: 0, social: 0, routine: 2, attention: 0, playfulness: -1 }
        }
      ]
    },
    {
      id: 'q8',
      question: 'Your ideal weekend activity is:',
      category: 'playfulness',
      options: [
        {
          id: 'q8a',
          text: 'Trying something new and exciting',
          scores: { energy: 2, social: 0, routine: -2, attention: 0, playfulness: 2 }
        },
        {
          id: 'q8b',
          text: 'Spending time with family/friends',
          scores: { energy: 0, social: 2, routine: 0, attention: 1, playfulness: 0 }
        },
        {
          id: 'q8c',
          text: 'Peaceful activities at home',
          scores: { energy: -2, social: -1, routine: 1, attention: -1, playfulness: -1 }
        },
        {
          id: 'q8d',
          text: 'Organizing and planning',
          scores: { energy: 0, social: 0, routine: 2, attention: 0, playfulness: -1 }
        }
      ]
    }
  ];
  
  export const PERSONALITY_PROFILES: Record<PersonalityType, PersonalityProfile> = {
    ENERGETIC_SOCIAL: {
      type: 'ENERGETIC_SOCIAL',
      name: 'The Social Butterfly',
      description: 'You love being around others and thrive on activity and interaction. You need a companion who can match your energy and social nature.',
      traits: ['Social', 'Energetic', 'Playful', 'Attention-seeking', 'Interactive'],
      idealBreeds: ['Bengal', 'Siamese', 'Maine Coon', 'Abyssinian'],
      emoji: '🦋',
      color: '#FFB3E6'
    },
    ENERGETIC_INDEPENDENT: {
      type: 'ENERGETIC_INDEPENDENT',
      name: 'The Free Spirit',
      description: 'You love adventure and activity but prefer to do things on your own terms. You need an active but independent companion.',
      traits: ['Independent', 'Energetic', 'Adventurous', 'Self-sufficient', 'Active'],
      idealBreeds: ['Savannah', 'Egyptian Mau', 'Ocicat', 'Chausie'],
      emoji: '🌟',
      color: '#A8E6CF'
    },
    CALM_SOCIAL: {
      type: 'CALM_SOCIAL',
      name: 'The Gentle Companion',
      description: 'You enjoy peaceful moments with loved ones and prefer calm, affectionate interactions. You need a gentle, social companion.',
      traits: ['Calm', 'Social', 'Affectionate', 'Gentle', 'Loyal'],
      idealBreeds: ['Ragdoll', 'Persian', 'Birman', 'Scottish Fold'],
      emoji: '🤗',
      color: '#FFD3A5'
    },
    CALM_INDEPENDENT: {
      type: 'CALM_INDEPENDENT',
      name: 'The Peaceful Soul',
      description: 'You value tranquility and independence, preferring quiet moments and low-maintenance relationships.',
      traits: ['Independent', 'Calm', 'Low-maintenance', 'Peaceful', 'Self-reliant'],
      idealBreeds: ['Russian Blue', 'British Shorthair', 'Chartreux', 'Norwegian Forest'],
      emoji: '🧘',
      color: '#A8C8EC'
    },
    PLAYFUL_SOCIAL: {
      type: 'PLAYFUL_SOCIAL',
      name: 'The Entertainer',
      description: 'You love fun, games, and entertaining others. You need a playful, social companion who can be your entertainment partner.',
      traits: ['Playful', 'Social', 'Entertaining', 'Attention-seeking', 'Fun-loving'],
      idealBreeds: ['Devon Rex', 'Cornish Rex', 'Munchkin', 'Japanese Bobtail'],
      emoji: '🎭',
      color: '#D4A5FF'
    },
    PLAYFUL_INDEPENDENT: {
      type: 'PLAYFUL_INDEPENDENT',
      name: 'The Solo Adventurer',
      description: 'You enjoy play and exploration but prefer to do it on your own terms. You need a playful but self-sufficient companion.',
      traits: ['Independent', 'Playful', 'Curious', 'Self-entertaining', 'Adventurous'],
      idealBreeds: ['Somali', 'Turkish Van', 'Singapura', 'LaPerm'],
      emoji: '🏃',
      color: '#FFB3BA'
    },
    GENTLE_SOCIAL: {
      type: 'GENTLE_SOCIAL',
      name: 'The Nurturing Heart',
      description: 'You prefer gentle, predictable interactions with others and value routine and stability in relationships.',
      traits: ['Gentle', 'Social', 'Nurturing', 'Routine-loving', 'Stable'],
      idealBreeds: ['Himalayan', 'Exotic Shorthair', 'Selkirk Rex', 'Manx'],
      emoji: '💝',
      color: '#B3FFD9'
    },
    GENTLE_INDEPENDENT: {
      type: 'GENTLE_INDEPENDENT',
      name: 'The Quiet Observer',
      description: 'You prefer gentle, independent living with minimal drama and maximum peace. You value quiet companionship.',
      traits: ['Independent', 'Gentle', 'Quiet', 'Observant', 'Peaceful'],
      idealBreeds: ['Korat', 'Nebelung', 'Havana Brown', 'Bombay'],
      emoji: '🌙',
      color: '#FFFACD'
    }
  };
  
  export const calculatePersonalityType = (scores: PersonalityScores): PersonalityType => {
    const { energy, social, routine, attention, playfulness } = scores;
    
    // Determine primary traits
    const isEnergetic = energy > 0;
    const isSocial = social > 0;
    const isPlayful = playfulness > 0;
    const isRoutineLoving = routine > 0;
    const isAttentionSeeking = attention > 0;
    
    // Complex logic to determine personality type
    if (isEnergetic && isSocial && isPlayful) {
      return 'ENERGETIC_SOCIAL';
    } else if (isEnergetic && !isSocial) {
      return 'ENERGETIC_INDEPENDENT';
    } else if (!isEnergetic && isSocial && !isPlayful) {
      return 'CALM_SOCIAL';
    } else if (!isEnergetic && !isSocial && !isPlayful) {
      return 'CALM_INDEPENDENT';
    } else if (isPlayful && isSocial && isAttentionSeeking) {
      return 'PLAYFUL_SOCIAL';
    } else if (isPlayful && !isSocial) {
      return 'PLAYFUL_INDEPENDENT';
    } else if (!isEnergetic && isSocial && isRoutineLoving) {
      return 'GENTLE_SOCIAL';
    } else {
      return 'GENTLE_INDEPENDENT';
    }
  };