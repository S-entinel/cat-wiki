import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed } from '../types/CatBreed';
import { RootStackParamList } from '../types/navigation';
import { AnimatedHeart } from '../components/AnimatedHeart';
import { Badge } from '../components/common/Badge';
import { catImages } from '../assets/catPhotos/imageMap';
import { 
  Colors, 
  Typography, 
  Spacing, 
  BorderRadius, 
  Shadows
} from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type BreedDetailRouteProp = RouteProp<RootStackParamList, 'BreedDetail'>;

interface Props {
  route: BreedDetailRouteProp;
}

export default function BreedDetailScreen({ route }: Props) {
  const navigation = useNavigation();
  const { toggleFavorite, isFavorite, getBreedById } = useDatabase();
  const [breed, setBreed] = useState<CatBreed>(route.params.breed);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params.breedId && route.params.breedId !== breed.id) {
      fetchBreedDetails();
    }
  }, [route.params.breedId]);

  const fetchBreedDetails = async () => {
    if (!route.params.breedId) return;
    
    setIsLoading(true);
    try {
      const breedData = await getBreedById(route.params.breedId);
      if (breedData) {
        setBreed(breedData);
      }
    } catch (error) {
      console.error('Failed to fetch breed details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFavoritePress = useCallback(async () => {
    try {
      await toggleFavorite(breed.id!);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }, [breed.id, toggleFavorite]);

  const getImageSource = (breed: CatBreed) => {
    if (breed.image_path && catImages[breed.image_path as keyof typeof catImages]) {
      return catImages[breed.image_path as keyof typeof catImages];
    }
    const nameBasedKey = `${breed.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    if (catImages[nameBasedKey as keyof typeof catImages]) {
      return catImages[nameBasedKey as keyof typeof catImages];
    }
    return catImages['placeholder.jpg'];
  };

  const renderTemperamentList = () => {
    const temperaments = breed.temperament.split(',').map(t => t.trim());
    
    return temperaments.map((temperament, index) => (
      <Text key={index} style={styles.temperamentItem}>
        {temperament}{index < temperaments.length - 1 ? ', ' : ''}
      </Text>
    ));
  };

  // Data visualization component for personality scores
  const renderPersonalityChart = () => {
    if (!breed.personality_scores) return null;

    const scores = breed.personality_scores;
    const maxScore = 10;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personality Profile</Text>
        <View style={styles.personalityContainer}>
          {Object.entries(scores).map(([trait, score]) => {
            const percentage = (score / maxScore) * 100;
            const traitLabel = trait.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            return (
              <View key={trait} style={styles.personalityRow}>
                <View style={styles.personalityHeader}>
                  <Text style={styles.personalityLabel}>{traitLabel}</Text>
                  <Text style={styles.personalityScore}>{score}/10</Text>
                </View>
                <View style={styles.personalityBarContainer}>
                  <View style={styles.personalityBarBackground}>
                    <View 
                      style={[
                        styles.personalityBarFill, 
                        { width: `${percentage}%` }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // Weight comparison visualization
  const renderWeightChart = () => {
    const femaleMin = breed.weight_min_female;
    const femaleMax = breed.weight_max_female;
    const maleMin = breed.weight_min_male;
    const maleMax = breed.weight_max_male;
    
    const maxWeight = Math.max(femaleMax, maleMax);
    const femaleAvg = (femaleMin + femaleMax) / 2;
    const maleAvg = (maleMin + maleMax) / 2;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight Comparison</Text>
        <View style={styles.weightContainer}>
          <View style={styles.weightRow}>
            <View style={styles.weightGenderContainer}>
              <Text style={styles.weightGenderLabel}>♀ Female</Text>
              <Text style={styles.weightRange}>{femaleMin} - {femaleMax} kg</Text>
            </View>
            <View style={styles.weightBarContainer}>
              <View style={styles.weightBarBackground}>
                <View 
                  style={[
                    styles.weightBarFill,
                    styles.femaleWeightBar,
                    { width: `${(femaleAvg / maxWeight) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
          
          <View style={styles.weightRow}>
            <View style={styles.weightGenderContainer}>
              <Text style={styles.weightGenderLabel}>♂ Male</Text>
              <Text style={styles.weightRange}>{maleMin} - {maleMax} kg</Text>
            </View>
            <View style={styles.weightBarContainer}>
              <View style={styles.weightBarBackground}>
                <View 
                  style={[
                    styles.weightBarFill,
                    styles.maleWeightBar,
                    { width: `${(maleAvg / maxWeight) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const imageSource = getImageSource(breed);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Hero Image Section */}
      <View style={styles.heroContainer}>
        <Image source={imageSource} style={styles.heroImage} resizeMode="cover" />
        
        {/* Header Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.8)']}
          style={styles.heroOverlay}
        >
          {/* Navigation Header */}
          <View style={[styles.navigationHeader, { paddingTop: Platform.OS === 'ios' ? 44 : 24 }]}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.favoriteButtonContainer}>
              <AnimatedHeart
                isFavorite={isFavorite(breed.id!)}
                onPress={handleFavoritePress}
                size="md"
                showBackground={false}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Breed Header */}
        <View style={styles.breedHeader}>
          <View style={styles.titleRow}>
            <View style={styles.titleContent}>
              <Text style={styles.breedName}>{breed.name}</Text>
              <Text style={styles.breedOrigin}>Origin: {breed.origin}</Text>
            </View>
            {breed.tica_code && (
              <Badge 
                text={breed.tica_code} 
                variant="primary" 
                size="sm"
              />
            )}
          </View>
        </View>

        {/* Quick Facts */}
        <View style={styles.quickFacts}>
          <Text style={styles.sectionTitle}>Quick Facts</Text>
          <View style={styles.factsList}>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>Coat Length:</Text>
              <Text style={styles.factValue}>{breed.coat_length}</Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>Body Type:</Text>
              <Text style={styles.factValue}>{breed.body_type}</Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>Activity Level:</Text>
              <Text style={styles.factValue}>{breed.activity_level}</Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>Lifespan:</Text>
              <Text style={styles.factValue}>{breed.lifespan_min}-{breed.lifespan_max} years</Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>Grooming Needs:</Text>
              <Text style={styles.factValue}>{breed.grooming_needs}</Text>
            </View>
            {breed.coat_pattern && (
              <View style={styles.factRow}>
                <Text style={styles.factLabel}>Coat Pattern:</Text>
                <Text style={styles.factValue}>{breed.coat_pattern}</Text>
              </View>
            )}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the {breed.name}</Text>
          <Text style={styles.description}>{breed.description}</Text>
        </View>

        {/* Temperament */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temperament</Text>
          <View style={styles.temperamentContainer}>
            {renderTemperamentList()}
          </View>
        </View>

        {/* Personality Profile Visualization */}
        {renderPersonalityChart()}

        {/* Weight Comparison Visualization */}
        {renderWeightChart()}

        {/* Care Requirements */}
        {breed.care_requirements && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Care Requirements</Text>
            <Text style={styles.bodyText}>{breed.care_requirements}</Text>
          </View>
        )}

        {/* Ideal For */}
        {breed.ideal_for && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ideal For</Text>
            <Text style={styles.bodyText}>{breed.ideal_for}</Text>
          </View>
        )}

        {/* Genetic Information */}
        {breed.genetic_info && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genetic Information</Text>
            <View style={styles.healthNote}>
              <Text style={styles.healthText}>{breed.genetic_info}</Text>
            </View>
          </View>
        )}

        {/* Health Issues */}
        {breed.health_issues && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Considerations</Text>
            <View style={styles.healthNote}>
              <Text style={styles.healthText}>{breed.health_issues}</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  
  // Hero Section
  heroContainer: {
    height: screenHeight * 0.4,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceVariant,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Navigation
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
  },
  favoriteButtonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
    ...Shadows.md,
  },
  
  // Content
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  
  // Breed Header
  breedHeader: {
    marginBottom: '6%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleContent: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  breedName: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  breedOrigin: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Quick Facts
  quickFacts: {
    marginBottom: '8%',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    padding: '5%',
  },
  factsList: {
    gap: Spacing.md,
  },
  factRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  factLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  factValue: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'right',
    flex: 1,
  },
  
  // Sections
  section: {
    marginBottom: '8%',
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: Spacing.sm,
  },
  
  // Description
  description: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * 1.7,
    color: Colors.text,
    fontWeight: Typography.fontWeight.normal,
  },
  
  // Body Text
  bodyText: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * 1.7,
    color: Colors.text,
    fontWeight: Typography.fontWeight.normal,
  },
  
  // Temperament
  temperamentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  temperamentItem: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.base * 1.5,
  },

  // Personality Profile Visualization
  personalityContainer: {
    gap: Spacing.lg,
  },
  personalityRow: {
    gap: Spacing.sm,
  },
  personalityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personalityLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  personalityScore: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray800,
  },
  personalityBarContainer: {
    marginTop: Spacing.xs,
  },
  personalityBarBackground: {
    height: 8,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  personalityBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },

  // Weight Visualization
  weightContainer: {
    gap: Spacing.lg,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  weightGenderContainer: {
    flex: 1,
  },
  weightGenderLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  weightRange: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  weightBarContainer: {
    flex: 2,
  },
  weightBarBackground: {
    height: 12,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  weightBarFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  femaleWeightBar: {
    backgroundColor: Colors.accent,
  },
  maleWeightBar: {
    backgroundColor: Colors.secondary,
  },
  
  // Health Note
  healthNote: {
    backgroundColor: Colors.warningSoft,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
  },
  healthText: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * 1.7,
    color: Colors.text,
    fontWeight: Typography.fontWeight.normal,
    fontStyle: 'italic',
  },
  
  bottomSpacing: {
    height: screenHeight * 0.08,
  },
});