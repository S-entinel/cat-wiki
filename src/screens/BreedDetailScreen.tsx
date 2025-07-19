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
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed } from '../types/CatBreed';
import { RootStackParamList } from '../types/navigation';
import { AnimatedHeart } from '../components/AnimatedHeart';
import { Badge } from '../components/common/Badge';
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
      console.error('Error fetching breed details:', error);
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
      console.error('Error toggling favorite:', error);
    }
  }, [breed.id, toggleFavorite]);

  const renderTemperamentList = () => {
    const temperaments = breed.temperament.split(',').map(t => t.trim());
    
    return temperaments.map((temperament, index) => (
      <Text key={index} style={styles.temperamentItem}>
        {temperament}{index < temperaments.length - 1 ? ' • ' : ''}
      </Text>
    ));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading breed details...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Clean Header */}
      <LinearGradient
        colors={[Colors.background, Colors.surfaceVariant]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{breed.name}</Text>
            <Text style={styles.headerSubtitle}>Cat Breed Encyclopedia</Text>
          </View>
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <AnimatedHeart
              isFavorite={isFavorite(breed.id!)}
              onPress={handleFavoritePress}
              size="md"
              showBackground={false}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

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
            <Badge 
              text={breed.tica_code} 
              variant="primary" 
              size="sm"
            />
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
              <Text style={styles.factLabel}>Weight Range:</Text>
              <Text style={styles.factValue}>{breed.weight_min_female}-{breed.weight_max_male} kg</Text>
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

        {/* Health Considerations */}
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: '8%',
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Clean Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  backIcon: {
    fontSize: Typography.fontSize.xl,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
    marginLeft: -2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Content
  content: {
    paddingHorizontal: '5%',
    paddingVertical: '4%',
  },
  
  // Breed Header
  breedHeader: {
    marginBottom: '8%',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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