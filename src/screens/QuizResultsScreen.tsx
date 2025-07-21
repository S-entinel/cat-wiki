import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useDatabase } from '../context/DatabaseContext';
import { catImages } from '../assets/catPhotos/imageMap';
import { PersonalityProfile, PersonalityScores } from '../types/PersonalityQuiz';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface QuizResultsScreenProps {
  route: {
    params: {
      personalityType: string;
      scores: PersonalityScores;
      profile: PersonalityProfile;
    };
  };
}

export default function QuizResultsScreen({ route }: QuizResultsScreenProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { breeds } = useDatabase();
  
  const { personalityType, scores, profile } = route.params;

  const findMatchingBreeds = () => {
    return breeds.filter(breed => 
      profile.idealBreeds.some(idealBreed => 
        breed.name.toLowerCase().includes(idealBreed.toLowerCase())
      )
    ).slice(0, 6);
  };

  const matchingBreeds = findMatchingBreeds();

  const handleRetakeQuiz = () => {
    // @ts-ignore
    navigation.navigate('PersonalityQuiz');
  };

  const handleExploreBreeds = () => {
    // @ts-ignore
    navigation.navigate('Breeds');
  };

  const handleBreedPress = (breed: any) => {
    // @ts-ignore
    navigation.navigate('Breeds', {
      screen: 'BreedDetail',
      params: { breed }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 1.5) return Colors.primary;
    if (score >= 0.5) return Colors.secondary;
    if (score >= -0.5) return Colors.accent;
    if (score >= -1.5) return Colors.warning;
    return Colors.error;
  };

  const getScoreLabel = (dimension: string, score: number) => {
    const labels = {
      energy: score > 0 ? 'Energetic' : 'Calm',
      social: score > 0 ? 'Social' : 'Independent',
      routine: score > 0 ? 'Routine-loving' : 'Flexible',
      attention: score > 0 ? 'Attention-seeking' : 'Low-maintenance',
      playfulness: score > 0 ? 'Playful' : 'Serious'
    };
    return labels[dimension as keyof typeof labels];
  };

  const getScoreWidth = (score: number) => {
    // Convert score (-2 to 2) to percentage (0 to 100)
    return ((score + 2) / 4) * 100;
  };

  const renderPersonalityCard = () => (
    <Card style={styles.personalityCard} shadow="lg">
      <View style={styles.personalityHeader}>
        <View style={styles.personalityIcon}>
          <Text style={styles.personalityEmoji}>{profile.emoji}</Text>
        </View>
        <Text style={styles.personalityType}>{profile.name}</Text>
        <Text style={styles.personalityDescription}>{profile.description}</Text>
      </View>
      
      <View style={styles.traitsContainer}>
        <Text style={styles.traitsTitle}>Your Cat-like Traits</Text>
        <View style={styles.traitsList}>
          {profile.traits.map((trait, index) => (
            <View key={index} style={styles.traitItem}>
              <Text style={styles.traitBullet}>•</Text>
              <Text style={styles.traitText}>{trait}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );

  const renderScoreBar = (dimension: string, score: number) => (
    <View key={dimension} style={styles.scoreItem}>
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreDimension}>
          {dimension.charAt(0).toUpperCase() + dimension.slice(1)}
        </Text>
        <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
          {getScoreLabel(dimension, score)}
        </Text>
      </View>
      <View style={styles.scoreBarBackground}>
        <View
          style={[
            styles.scoreBarFill,
            {
              width: `${getScoreWidth(score)}%`,
              backgroundColor: getScoreColor(score),
            }
          ]}
        />
      </View>
    </View>
  );

  const renderBreedCard = (breed: any) => {
    const getImageSource = (breed: any) => {
      // Try breed.image_path first (should be filename like 'abyssinian.jpg')
      if (breed.image_path && catImages[breed.image_path as keyof typeof catImages]) {
        return catImages[breed.image_path as keyof typeof catImages];
      }
      
      // Try name-based key as fallback (convert "Abyssinian" -> "abyssinian.jpg")
      const nameBasedKey = `${breed.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      if (catImages[nameBasedKey as keyof typeof catImages]) {
        return catImages[nameBasedKey as keyof typeof catImages];
      }
      
      return catImages['placeholder.jpg'];
    };
    
    const imageSource = getImageSource(breed);
    
    return (
      <TouchableOpacity
        key={breed.id}
        style={styles.breedCard}
        onPress={() => handleBreedPress(breed)}
        activeOpacity={0.8}
      >
        <View style={styles.breedImageContainer}>
          <Image source={imageSource} style={styles.breedImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.breedImageOverlay}
          />
        </View>
        <View style={styles.breedInfo}>
          <Text style={styles.breedName} numberOfLines={1}>{breed.name}</Text>
          <Text style={styles.breedOrigin} numberOfLines={1}>{breed.origin}</Text>
          <Badge
            text={breed.activity_level}
            variant="accent"
            size="xs"
            style={styles.breedBadge}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const groupBreedsIntoPairs = (breeds: any[]) => {
    const pairs = [];
    for (let i = 0; i < breeds.length; i += 2) {
      pairs.push(breeds.slice(i, i + 2));
    }
    return pairs;
  };

  const breedPairs = groupBreedsIntoPairs(matchingBreeds);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Enhanced Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark, Colors.accent]}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <Text style={styles.headerTitle}>Your Purrfect Match!</Text>
        <Text style={styles.headerSubtitle}>Discover your ideal feline companion</Text>
      </LinearGradient>
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
      >
        {/* Enhanced Personality Card */}
        {renderPersonalityCard()}
        
        {/* Enhanced Scores Card */}
        <Card style={styles.scoresCard} shadow="lg">
          <Text style={styles.scoresTitle}>Your Personality Breakdown</Text>
          <Text style={styles.scoresSubtitle}>How you match with different cat traits</Text>
          <View style={styles.scoresContainer}>
            {Object.entries(scores).map(([dimension, score]) => renderScoreBar(dimension, score))}
          </View>
        </Card>

        {/* Enhanced Breeds Card */}
        <Card style={styles.breedsCard} shadow="lg">
          <Text style={styles.breedsTitle}>Your Recommended Breeds</Text>
          <Text style={styles.breedsSubtitle}>These cat breeds perfectly match your personality</Text>
          
          {matchingBreeds.length > 0 ? (
            <View style={styles.breedsGrid}>
              {breedPairs.map((pair, pairIndex) => (
                <View key={pairIndex} style={styles.breedRow}>
                  {pair.map(breed => renderBreedCard(breed))}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noBreedsContainer}>
              <Text style={styles.noBreedsIcon}>🐾</Text>
              <Text style={styles.noBreedsText}>No perfect matches found</Text>
              <Text style={styles.noBreedsSubtext}>Don't worry! Explore all breeds to find your ideal companion</Text>
            </View>
          )}
        </Card>

        {/* Enhanced Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Take Quiz Again"
            onPress={handleRetakeQuiz}
            variant="outline"
            size="lg"
            style={styles.retakeButton}
          />
          
          <Button
            title="Explore All Breeds"
            onPress={handleExploreBreeds}
            variant="primary"
            size="lg"
            style={styles.exploreButton}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Enhanced Header
  header: {
    paddingHorizontal: '5%',
    paddingBottom: '8%',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textInverse,
    opacity: 0.9,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  
  scrollContent: {
    paddingHorizontal: '5%',
    paddingTop: '4%',
  },
  
  // Enhanced Personality Card
  personalityCard: {
    marginBottom: '6%',
    padding: '6%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
  },
  personalityHeader: {
    alignItems: 'center',
    marginBottom: '6%',
  },
  personalityIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4%',
    ...Shadows.md,
  },
  personalityEmoji: {
    fontSize: 36,
  },
  personalityType: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.gray800,
    marginBottom: '3%',
    textAlign: 'center',
  },
  personalityDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * 1.6,
  },
  
  traitsContainer: {
    width: '100%',
  },
  traitsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: '4%',
    textAlign: 'center',
  },
  traitsList: {
    gap: Spacing.sm,
  },
  traitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  traitBullet: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray700,
    marginRight: Spacing.md,
    fontWeight: Typography.fontWeight.bold,
    width: 12,
  },
  traitText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    flex: 1,
    lineHeight: Typography.fontSize.base * 1.5,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Enhanced Scores Card
  scoresCard: {
    marginBottom: '6%',
    padding: '6%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
  },
  scoresTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  scoresSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontWeight: Typography.fontWeight.medium,
  },
  scoresContainer: {
    gap: Spacing.md,
  },
  scoreItem: {
    marginBottom: 0,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  scoreDimension: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  scoreValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  scoreBarBackground: {
    height: 10,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  
  // Enhanced Breeds Card
  breedsCard: {
    marginBottom: '6%',
    padding: '6%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
  },
  breedsTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  breedsSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: '6%',
    fontWeight: Typography.fontWeight.medium,
  },
  breedsGrid: {
    gap: '4%',
  },
  breedRow: {
    flexDirection: 'row',
    gap: '4%',
  },
  
  // Enhanced Breed Cards
  breedCard: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  breedImageContainer: {
    position: 'relative',
    height: screenHeight * 0.15,
  },
  breedImage: {
    width: '100%',
    height: '100%',
  },
  breedImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  breedInfo: {
    padding: '4%',
  },
  breedName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  breedOrigin: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  breedBadge: {
    alignSelf: 'flex-start',
  },
  
  // Enhanced No Breeds State
  noBreedsContainer: {
    alignItems: 'center',
    paddingVertical: '8%',
  },
  noBreedsIcon: {
    fontSize: 48,
    marginBottom: '4%',
    opacity: 0.7,
  },
  noBreedsText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: '2%',
    textAlign: 'center',
  },
  noBreedsSubtext: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * 1.5,
  },
  
  // Enhanced Action Buttons
  actionButtons: {
    gap: '4%',
    marginBottom: '4%',
  },
  retakeButton: {
    marginBottom: 0,
  },
  exploreButton: {
    marginBottom: 0,
  },
});