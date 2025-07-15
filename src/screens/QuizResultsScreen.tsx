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

const { width: screenWidth } = Dimensions.get('window');

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
      playfulness: score > 0 ? 'Playful' : 'Serious',
    };
    return labels[dimension as keyof typeof labels] || 'Unknown';
  };

  const handleBreedPress = (breed: any) => {
    // @ts-ignore
    navigation.navigate('Breeds', {
      screen: 'BreedDetail',
      params: { breed }
    });
  };

  const handleRetakeQuiz = () => {
    // @ts-ignore
    navigation.navigate('PersonalityQuiz');
  };

  const handleExploreBreeds = () => {
    // @ts-ignore
    navigation.navigate('Breeds');
  };

  const renderPersonalityCard = () => (
    <Card style={styles.personalityCard} shadow="lg">
      <View style={styles.personalityHeader}>
        <Text style={styles.personalityType}>{personalityType}</Text>
        <Text style={styles.personalityDescription}>{profile.description}</Text>
      </View>
      
      <View style={styles.traitsContainer}>
        <Text style={styles.traitsTitle}>Your Key Traits</Text>
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

  const renderScoreBar = (dimension: string, score: number) => {
    const normalizedScore = Math.max(-2, Math.min(2, score));
    const percentage = ((normalizedScore + 2) / 4) * 100;
    const color = getScoreColor(normalizedScore);

    return (
      <View key={dimension} style={styles.scoreItem}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreDimension}>{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</Text>
          <Text style={styles.scoreValue}>{normalizedScore.toFixed(1)}</Text>
        </View>
        <View style={styles.scoreBarContainer}>
          <View style={styles.scoreBarBackground}>
            <View style={[styles.scoreBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
            <LinearGradient
              colors={[color, `${color}80`]}
              style={[styles.scoreBarGradient, { width: `${percentage}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.scoreLabel}>{getScoreLabel(dimension, normalizedScore)}</Text>
        </View>
      </View>
    );
  };

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
        <Image source={imageSource} style={styles.breedImage} resizeMode="cover" />
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
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <Text style={styles.headerTitle}>Your Results</Text>
        <Text style={styles.headerSubtitle}>Meet your perfect feline match!</Text>
      </LinearGradient>
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
      >
        {renderPersonalityCard()}
        
        <Card style={styles.scoresCard} shadow="md">
          <Text style={styles.scoresTitle}>Your Personality Breakdown</Text>
          <View style={styles.scoresContainer}>
            {Object.entries(scores).map(([dimension, score]) => renderScoreBar(dimension, score))}
          </View>
        </Card>

        <Card style={styles.breedsCard} shadow="md">
          <Text style={styles.breedsTitle}>Recommended Breeds</Text>
          <Text style={styles.breedsSubtitle}>These breeds match your personality perfectly</Text>
          
          <View style={styles.breedsGrid}>
            {breedPairs.map((pair, pairIndex) => (
              <View key={pairIndex} style={styles.breedRow}>
                {pair.map(breed => renderBreedCard(breed))}
              </View>
            ))}
          </View>
          
          {matchingBreeds.length === 0 && (
            <View style={styles.noBreedsContainer}>
              <Text style={styles.noBreedsText}>No matching breeds found in database</Text>
              <Text style={styles.noBreedsSubtext}>Try exploring all breeds to find your perfect match!</Text>
            </View>
          )}
        </Card>

        <View style={styles.actionButtons}>
          <Button
            title="Retake Quiz"
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textInverse,
    opacity: 0.9,
    fontWeight: Typography.fontWeight.medium,
  },
  
  personalityCard: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
  },
  personalityHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  personalityType: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  personalityDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  
  traitsContainer: {
    marginTop: Spacing.lg,
  },
  traitsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
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
    color: Colors.primary,
    marginRight: Spacing.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  traitText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    flex: 1,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  
  scoresCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
  },
  scoresTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  scoresContainer: {
    gap: Spacing.lg,
  },
  scoreItem: {
    marginBottom: Spacing.md,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  scoreDimension: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  scoreValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  scoreBarContainer: {
    gap: Spacing.xs,
  },
  scoreBarBackground: {
    height: 8,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  scoreBarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  scoreLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  breedsCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
  },
  breedsTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  breedsSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  breedsGrid: {
    gap: Spacing.md,
  },
  breedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  breedCard: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
    maxWidth: (screenWidth - (Spacing.lg * 2) - (Spacing.xl * 2) - Spacing.md) / 2,
  },
  breedImage: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.surfaceVariant,
  },
  breedInfo: {
    padding: Spacing.md,
  },
  breedName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  breedOrigin: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  breedBadge: {
    alignSelf: 'flex-start',
  },
  
  noBreedsContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  noBreedsText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  noBreedsSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  retakeButton: {
    flex: 1,
  },
  exploreButton: {
    flex: 1,
  },
});