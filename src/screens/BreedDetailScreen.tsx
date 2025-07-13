// src/screens/BreedDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed, getLifespanString, getWeightRangeString } from '../types/CatBreed';
import { RootStackParamList } from '../types/navigation';
import { AnimatedHeart } from '../components/AnimatedHeart';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { catImages } from '../assets/catPhotos/imageMap';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type BreedDetailRouteProp = RouteProp<RootStackParamList, 'BreedDetail'>;
type BreedDetailNavigationProp = StackNavigationProp<RootStackParamList, 'BreedDetail'>;

interface Props {
  route: BreedDetailRouteProp;
}

export default function BreedDetailScreen({ route }: Props) {
  const navigation = useNavigation<BreedDetailNavigationProp>();
  const { toggleFavorite, isFavorite, getBreedById } = useDatabase();
  const [breed, setBreed] = useState<CatBreed>(route.params.breed);
  const [isLoading, setIsLoading] = useState(false);

  // If we have a breedId, fetch the latest data
  useEffect(() => {
    if (route.params.breedId && route.params.breedId !== breed.id) {
      loadBreedDetails();
    }
  }, [route.params.breedId]);

  const loadBreedDetails = async () => {
    if (!route.params.breedId) return;
    
    setIsLoading(true);
    try {
      const latestBreed = await getBreedById(route.params.breedId);
      if (latestBreed) {
        setBreed(latestBreed);
      }
    } catch (error) {
      console.error('Error loading breed details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoritePress = async () => {
    if (breed.id) {
      await toggleFavorite(breed.id);
    }
  };

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return Colors.success;
      case 'Low-Medium': return Colors.warning;
      case 'Medium': return Colors.info;
      case 'Medium-High': return Colors.secondary;
      case 'High': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const getGroomingLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return Colors.success;
      case 'Low-Medium': return Colors.success;
      case 'Medium': return Colors.warning;
      case 'Medium-High': return Colors.secondary;
      case 'High': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const getStatWidth = (level: string): string => {
    const levels = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High'];
    const index = levels.indexOf(level);
    return `${Math.max(20, (index + 1) * 20)}%`;
  };

  const renderInfoCard = (title: string, content: string, icon: string) => (
    <Card style={styles.infoCard} variant="default">
      <View style={styles.infoHeader}>
        <Text style={styles.infoIcon}>{icon}</Text>
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Text style={styles.infoContent}>{content}</Text>
    </Card>
  );

  const renderStatBar = (label: string, level: string, color: string) => (
    <View style={styles.statBar}>
      <View style={styles.statBarHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <Badge 
          text={level} 
          variant={level === 'Low' ? 'success' : level === 'High' ? 'error' : 'warning'} 
          size="sm"
        />
      </View>
      <View style={styles.statBarContainer}>
        <View style={styles.statBarBackground}>
          <View 
            style={[
              styles.statBarFill, 
              { backgroundColor: color, width: getStatWidth(level) as any }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  const renderTemperamentTags = () => {
    const traits = breed.temperament.split(',').map(trait => trait.trim());
    return (
      <View style={styles.temperamentContainer}>
        {traits.map((trait, index) => (
          <Badge 
            key={index}
            text={trait}
            variant="accent"
            size="sm"
            style={styles.temperamentTag}
          />
        ))}
      </View>
    );
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section with Image */}
      <View style={styles.heroSection}>
        <Image 
          source={catImages[breed.image_path as keyof typeof catImages] || catImages['placeholder.jpg']}
          style={styles.heroImage}
          resizeMode="cover"
          defaultSource={require('../assets/catPhotos/placeholder.jpg')}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.heroOverlay}
        >
          <View style={styles.heroContent}>
            <View style={styles.breedTitleContainer}>
              <Text style={styles.breedName}>{breed.name}</Text>
              <View style={styles.headerBadges}>
                <Badge 
                  text={breed.tica_code} 
                  variant="primary" 
                  size="md"
                  style={styles.ticaBadge}
                />
              </View>
            </View>
            <Text style={styles.breedOrigin}>📍 {breed.origin}</Text>
          </View>
          <View style={styles.favoriteButtonContainer}>
            <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
              <AnimatedHeart
                isFavorite={breed.id ? isFavorite(breed.id) : false}
                onPress={() => {}}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Stats */}
      <Card style={styles.quickStatsCard} variant="elevated">
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getLifespanString(breed)}</Text>
            <Text style={styles.statLabel}>Lifespan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{breed.coat_length}</Text>
            <Text style={styles.statLabel}>Coat Length</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getWeightRangeString(breed)}</Text>
            <Text style={styles.statLabel}>Weight Range</Text>
          </View>
        </View>
      </Card>

      {/* Care Requirements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Care Requirements</Text>
        <Card style={styles.careCard} variant="default">
          {renderStatBar('Activity Level', breed.activity_level, getActivityLevelColor(breed.activity_level))}
          {renderStatBar('Grooming Needs', breed.grooming_needs, getGroomingLevelColor(breed.grooming_needs))}
        </Card>
      </View>

      {/* Physical Characteristics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Physical Characteristics</Text>
        <View style={styles.characteristicsGrid}>
          {renderInfoCard('Body Type', breed.body_type, '🏗️')}
          {breed.coat_pattern && renderInfoCard('Coat Pattern', breed.coat_pattern, '🎨')}
          {renderInfoCard('Female Weight', getWeightRangeString(breed, 'female'), '⚖️')}
          {renderInfoCard('Male Weight', getWeightRangeString(breed, 'male'), '⚖️')}
        </View>
      </View>

      {/* Temperament */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temperament</Text>
        <Card style={styles.temperamentCard} variant="default">
          {renderTemperamentTags()}
        </Card>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Breed</Text>
        <Card style={styles.descriptionCard} variant="default">
          <Text style={styles.description}>{breed.description}</Text>
        </Card>
      </View>

      {/* Care Information */}
      {breed.care_requirements && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Requirements</Text>
          <Card style={styles.careInfoCard} variant="default">
            <View style={styles.careHeader}>
              <Text style={styles.careIcon}>🎯</Text>
              <Text style={styles.careTitle}>What They Need</Text>
            </View>
            <Text style={styles.careText}>{breed.care_requirements}</Text>
          </Card>
        </View>
      )}

      {/* Ideal For */}
      {breed.ideal_for && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfect For</Text>
          <Card style={styles.idealForCard} variant="default">
            <View style={styles.idealForHeader}>
              <Text style={styles.idealForIcon}>👥</Text>
              <Text style={styles.idealForTitle}>Ideal Households</Text>
            </View>
            <Text style={styles.idealForText}>{breed.ideal_for}</Text>
          </Card>
        </View>
      )}

      {/* Health Information */}
      {breed.health_issues && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Considerations</Text>
          <Card style={styles.healthCard} variant="outlined">
            <View style={styles.healthHeader}>
              <Text style={styles.healthIcon}>🏥</Text>
              <Text style={styles.healthTitle}>Health Notes</Text>
            </View>
            <Text style={styles.healthText}>{breed.health_issues}</Text>
          </Card>
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
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
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Hero Section
  heroSection: {
    position: 'relative',
    height: screenHeight * 0.4,
    marginBottom: Spacing.lg,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  breedTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.sm,
  },
  breedName: {
    fontSize: Typography.fontSize.xxxxl,
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.textInverse,
    flex: 1,
    marginRight: Spacing.md,
  },
  headerBadges: {
    alignItems: 'flex-end',
  },
  ticaBadge: {
    marginBottom: Spacing.xs,
  },
  breedOrigin: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textInverse,
    fontWeight: Typography.fontWeight.medium,
    opacity: 0.9,
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.lg,
  },
  favoriteButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
    ...Shadows.md,
  },
  
  // Quick Stats
  quickStatsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  
  // Sections
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.lg,
  },
  
  // Care Requirements
  careCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
  },
  statBar: {
    marginBottom: Spacing.lg,
  },
  statBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statBarContainer: {
    height: 8,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  statBarBackground: {
    flex: 1,
    height: '100%',
  },
  statBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  
  // Physical Characteristics
  characteristicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  infoCard: {
    width: (screenWidth - Spacing.lg * 2 - Spacing.md) / 2,
    padding: Spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoIcon: {
    fontSize: Typography.fontSize.lg,
    marginRight: Spacing.sm,
  },
  infoTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoContent: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  
  // Temperament
  temperamentCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
  },
  temperamentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  temperamentTag: {
    marginBottom: Spacing.xs,
  },
  
  // Description
  descriptionCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
  },
  description: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    color: Colors.text,
  },
  
  // Care Information
  careInfoCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: `${Colors.success}10`,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  careIcon: {
    fontSize: Typography.fontSize.xl,
    marginRight: Spacing.sm,
  },
  careTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.success,
  },
  careText: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    color: Colors.text,
  },
  
  // Ideal For
  idealForCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: `${Colors.secondary}10`,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  idealForHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  idealForIcon: {
    fontSize: Typography.fontSize.xl,
    marginRight: Spacing.sm,
  },
  idealForTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.secondary,
  },
  idealForText: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    color: Colors.text,
  },
  
  // Health Information
  healthCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: `${Colors.warning}10`,
    borderColor: Colors.warning,
    borderLeftWidth: 4,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  healthIcon: {
    fontSize: Typography.fontSize.xl,
    marginRight: Spacing.sm,
  },
  healthTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.warning,
  },
  healthText: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    color: Colors.text,
  },
  
  bottomSpacing: {
    height: Spacing.xxxl,
  },
});