
import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed } from '../types/CatBreed';
import { RootStackParamList } from '../types/navigation';
import { AnimatedHeart } from '../components/AnimatedHeart';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { catImages } from '../assets/catPhotos/imageMap';
import { 
  Colors, 
  Typography, 
  Spacing, 
  BorderRadius, 
  Shadows, 
  Layout
} from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const IMAGE_HEIGHT = screenHeight * 0.4;

type BreedDetailRouteProp = RouteProp<RootStackParamList, 'BreedDetail'>;

interface Props {
  route: BreedDetailRouteProp;
}

export default function BreedDetailScreen({ route }: Props) {
  const navigation = useNavigation();
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

  const handleFavoritePress = useCallback(async () => {
    if (breed.id) {
      try {
        await toggleFavorite(breed.id);
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    }
  }, [breed.id, toggleFavorite]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Get activity level badge variant
  const getActivityVariant = (level: string): 'success' | 'warning' | 'error' | 'info' | 'primary' => {
    switch (level) {
      case 'Low': return 'success';
      case 'Low-Medium': return 'warning';
      case 'Medium': return 'info';
      case 'Medium-High': return 'primary';
      case 'High': return 'error';
      default: return 'primary';
    }
  };

  // Render temperament tags
  const renderTemperamentTags = () => {
    const temperamentTraits = breed.temperament.split(',').map(trait => trait.trim());
    
    return (
      <View style={styles.temperamentContainer}>
        {temperamentTraits.map((trait, index) => (
          <Badge
            key={index}
            text={trait}
            variant="primary"
            size="sm"
            outlined
            style={styles.temperamentTag}
          />
        ))}
      </View>
    );
  };

  const imageSource = catImages[breed.tica_code as keyof typeof catImages];

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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        {/* Hero Image Section */}
        <View style={styles.imageContainer}>
          <Image 
            source={imageSource || { uri: breed.image_path }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          
          {/* Navigation Header */}
          <View style={styles.navigationHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.favoriteButtonHeader}
              onPress={handleFavoritePress}
            >
              <AnimatedHeart
                isFavorite={isFavorite(breed.id!)}
                onPress={handleFavoritePress}
                size="lg"
                showBackground
              />
            </TouchableOpacity>
          </View>
          
          {/* Breed Title Overlay */}
          <View style={styles.heroContent}>
            <Badge 
              text={breed.tica_code} 
              variant="primary" 
              size="sm"
              style={styles.ticaBadge}
            />
            <Text style={styles.heroTitle}>{breed.name}</Text>
            <View style={styles.heroOrigin}>
              <Text style={styles.originIcon}>📍</Text>
              <Text style={styles.originText}>{breed.origin}</Text>
            </View>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Info Cards */}
          <View style={styles.quickInfoSection}>
            <View style={styles.quickInfoRow}>
              <Card style={styles.quickInfoCard} variant="elevated" shadow="sm">
                <Text style={styles.quickInfoIcon}>🧬</Text>
                <Text style={styles.quickInfoLabel}>Coat</Text>
                <Text style={styles.quickInfoValue}>{breed.coat_length}</Text>
              </Card>
              
              <Card style={styles.quickInfoCard} variant="elevated" shadow="sm">
                <Text style={styles.quickInfoIcon}>🏗️</Text>
                <Text style={styles.quickInfoLabel}>Body Type</Text>
                <Text style={styles.quickInfoValue}>{breed.body_type}</Text>
              </Card>
              
              <Card style={styles.quickInfoCard} variant="elevated" shadow="sm">
                <Text style={styles.quickInfoIcon}>🎨</Text>
                <Text style={styles.quickInfoLabel}>Pattern</Text>
                <Text style={styles.quickInfoValue}>{breed.coat_pattern || 'Various'}</Text>
              </Card>
            </View>
          </View>

          {/* Physical Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Characteristics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <Card style={styles.statCard} variant="elevated" shadow="sm">
                  <View style={styles.statHeader}>
                    <Text style={styles.statIcon}>⏰</Text>
                    <Text style={styles.statLabel}>Lifespan</Text>
                  </View>
                  <Text style={styles.statValue}>{breed.lifespan_min}-{breed.lifespan_max} years</Text>
                </Card>

                <Card style={styles.statCard} variant="elevated" shadow="sm">
                  <View style={styles.statHeader}>
                    <Text style={styles.statIcon}>⚖️</Text>
                    <Text style={styles.statLabel}>Weight</Text>
                  </View>
                  <Text style={styles.statValue}>{breed.weight_min_female}-{breed.weight_max_male} kg</Text>
                </Card>
              </View>

              <View style={styles.statsRow}>
                <Card style={styles.statCard} variant="elevated" shadow="sm">
                  <View style={styles.statHeader}>
                    <Text style={styles.statIcon}>⚡</Text>
                    <Text style={styles.statLabel}>Activity Level</Text>
                  </View>
                  <Badge 
                    text={breed.activity_level} 
                    variant={getActivityVariant(breed.activity_level)}
                    size="sm"
                  />
                </Card>

                <Card style={styles.statCard} variant="elevated" shadow="sm">
                  <View style={styles.statHeader}>
                    <Text style={styles.statIcon}>✂️</Text>
                    <Text style={styles.statLabel}>Grooming</Text>
                  </View>
                  <Text style={styles.groomingText}>{breed.grooming_needs}</Text>
                </Card>
              </View>
            </View>
          </View>

          {/* Temperament Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temperament</Text>
            <Card style={styles.temperamentCard} variant="elevated" shadow="sm">
              {renderTemperamentTags()}
            </Card>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Breed</Text>
            <Card style={styles.descriptionCard} variant="elevated" shadow="sm">
              <Text style={styles.description}>{breed.description}</Text>
            </Card>
          </View>

          {/* Care Requirements */}
          {breed.care_requirements && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Care Requirements</Text>
              <Card style={styles.infoCard} variant="filled">
                <View style={styles.infoHeader}>
                  <Text style={styles.infoIcon}>🎯</Text>
                  <Text style={styles.infoTitle}>What They Need</Text>
                </View>
                <Text style={styles.infoText}>{breed.care_requirements}</Text>
              </Card>
            </View>
          )}

          {/* Ideal For */}
          {breed.ideal_for && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Perfect For</Text>
              <Card style={styles.infoCard} variant="filled">
                <View style={styles.infoHeader}>
                  <Text style={styles.infoIcon}>👥</Text>
                  <Text style={styles.infoTitle}>Ideal Households</Text>
                </View>
                <Text style={styles.infoText}>{breed.ideal_for}</Text>
              </Card>
            </View>
          )}

          {/* Health Information */}
          {breed.health_issues && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health Considerations</Text>
              <Card style={styles.healthCard} variant="outlined">
                <View style={styles.infoHeader}>
                  <Text style={styles.infoIcon}>🏥</Text>
                  <Text style={styles.healthTitle}>Health Notes</Text>
                </View>
                <Text style={styles.healthText}>{breed.health_issues}</Text>
              </Card>
            </View>
          )}

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
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
    paddingHorizontal: Layout.content.paddingHorizontal,
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Hero Image Section
  imageContainer: {
    position: 'relative',
    height: IMAGE_HEIGHT,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  
  // Navigation
  navigationHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.content.paddingHorizontal,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: Typography.fontSize.xl,
    color: Colors.textInverse,
    fontWeight: Typography.fontWeight.bold,
  },
  favoriteButtonHeader: {
    // AnimatedHeart will handle its own styling
  },
  
  // Hero Content
  heroContent: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Layout.content.paddingHorizontal,
    right: Layout.content.paddingHorizontal,
  },
  ticaBadge: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: Typography.fontSize.xxxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textInverse,
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroOrigin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originIcon: {
    fontSize: Typography.fontSize.base,
    marginRight: Spacing.xs,
  },
  originText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textInverse,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Content Container
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing.xl,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
  },
  
  // Quick Info Section
  quickInfoSection: {
    paddingHorizontal: Layout.content.paddingHorizontal,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  quickInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  quickInfoCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    minHeight: 90,
  },
  quickInfoIcon: {
    fontSize: Typography.fontSize.xxl,
    marginBottom: Spacing.sm,
  },
  quickInfoLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  quickInfoValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  
  // Sections
  section: {
    paddingHorizontal: Layout.content.paddingHorizontal,
    marginBottom: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  
  // Physical Stats
  statsContainer: {
    gap: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statIcon: {
    fontSize: Typography.fontSize.base,
    marginRight: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  statValue: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },
  groomingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Temperament
  temperamentCard: {
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
    padding: Spacing.lg,
  },
  description: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    color: Colors.text,
  },
  
  // Info Cards
  infoCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.primarySoft,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoIcon: {
    fontSize: Typography.fontSize.lg,
    marginRight: Spacing.sm,
  },
  infoTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  infoText: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    color: Colors.text,
  },
  
  // Health Card
  healthCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.warningSoft,
    borderColor: Colors.warning,
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
    height: Layout.tabBar.heightSafe,
  },
});