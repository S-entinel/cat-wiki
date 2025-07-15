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
      playfulness: score > 0 ? 'Playful' : 'Serious'
    };
    return labels[dimension as keyof typeof labels] || dimension;
  };

  const handleBreedPress = (breed: any) => {
    // @ts-ignore
    navigation.navigate('BreedDetail', { breed, breedId: breed.id });
  };

  const handleRetakeQuiz = () => {
    navigation.goBack();
  };

  const handleExploreBreeds = () => {
    // @ts-ignore
    navigation.navigate('Breeds');
  };

  const renderPersonalityCard = () => (
    <Card style={styles.personalityCard} shadow="lg">
      <View style={styles.personalityHeader}>
        <View style={[styles.personalityIcon, { backgroundColor: profile.color }]}>
          <Text style={styles.personalityEmoji}>{profile.emoji}</Text>
        </View>
        <View style={styles.personalityInfo}>
          <Text style={styles.personalityName}>{profile.name}</Text>
          <Text style={styles.personalityType}>{personalityType.replace('_', ' ')}</Text>
        </View>
      </View>
      
      <Text style={styles.personalityDescription}>{profile.description}</Text>
      
      <View style={styles.traitsContainer}>
        {profile.traits.map((trait, index) => (
          <Badge
            key={index}
            text={trait}
            variant="primary"
            size="sm"
            style={styles.traitBadge}
          />
        ))}
      </View>
    </Card>
  );

  const renderScoreBar = (dimension: string, score: number) => {
    const normalizedScore = Math.max(-2, Math.min(2, score));
    const percentage = ((normalizedScore + 2) / 4) * 100;
    
    return (
      <View style={styles.scoreItem} key={dimension}>
        <Text style={styles.scoreDimension}>{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</Text>
        <View style={styles.scoreBarContainer}>
          <View style={styles.scoreBar}>
            <LinearGradient
              colors={[getScoreColor(normalizedScore), getScoreColor(normalizedScore)]}
              style={[styles.scoreBarFill, { width: `${Math.abs(percentage - 50) * 2}%` }]}
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
    const imageSource = catImages[breed.tica_code as keyof typeof catImages] || catImages['placeholder.jpg'];
    
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
            {matchingBreeds.map(breed => renderBreedCard(breed))}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  personalityIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  personalityEmoji: {
    fontSize: 32,
  },
  personalityInfo: {
    flex: 1,
  },
  personalityName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  personalityType: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  personalityDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * 1.5,
    marginBottom: Spacing.lg,
    fontWeight: Typography.fontWeight.normal,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  traitBadge: {
    marginRight: 0,
    marginBottom: 0,
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
    gap: Spacing.sm,
  },
  scoreDimension: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  scoreBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  scoreLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    minWidth: 80,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  breedCard: {
    width: (screenWidth - (Spacing.lg * 2) - (Spacing.xl * 2) - Spacing.md) / 2,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.xs,
  },
  breedImage: {
    width: '100%',
    height: 100,
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