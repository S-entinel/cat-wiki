// src/screens/FavoritesScreen.tsx
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed, getLifespanString, getWeightRangeString } from '../types/CatBreed';
import { RootTabParamList } from '../types/navigation';
import { AnimatedHeart } from '../components/AnimatedHeart';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { catImages } from '../assets/catPhotos/imageMap';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

type FavoritesScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Favorites'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, isLoading, error, toggleFavorite, isFavorite, getFavorites } = useDatabase();

  const handleRetry = async () => {
    try {
      await getFavorites();
    } catch (err) {
      console.error('Retry failed:', err);
    }
  };

  const handleFavoritePress = async (breed: CatBreed, event: any) => {
    event.stopPropagation();
    if (breed.id) {
      await toggleFavorite(breed.id);
    }
  };

  const handleBreedPress = (breed: CatBreed) => {
    // Navigate to Breeds tab first, then to the detail screen
    (navigation as any).navigate('Breeds', { 
      screen: 'BreedDetail', 
      params: { breed, breedId: breed.id } 
    });
  };

  const handleExploreBreeds = () => {
    navigation.navigate('Breeds');
  };

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'success';
      case 'Low-Medium': return 'warning';
      case 'Medium': return 'accent';
      case 'Medium-High': return 'secondary';
      case 'High': return 'error';
      default: return 'primary';
    }
  };

  const renderBreed = ({ item }: { item: CatBreed }) => (
    <Card style={styles.breedCard} variant="elevated">
      <TouchableOpacity 
        style={styles.breedCardContent}
        onPress={() => handleBreedPress(item)}
        activeOpacity={0.7}
      >
        {/* Breed Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={catImages[item.image_path as keyof typeof catImages] || catImages['placeholder.jpg']}
            style={styles.breedImage}
            resizeMode="cover"
            defaultSource={require('../assets/catPhotos/placeholder.jpg')}
          />
          <View style={styles.favoriteButtonContainer}>
            <AnimatedHeart
              isFavorite={item.id ? isFavorite(item.id) : false}
              onPress={(event) => handleFavoritePress(item, event)}
            />
          </View>
        </View>

        {/* Breed Information */}
        <View style={styles.breedInfo}>
          <View style={styles.breedHeader}>
            <Text style={styles.breedName} numberOfLines={1}>
              {item.name}
            </Text>
            <Badge 
              text={item.tica_code} 
              variant="error" 
              size="sm"
              style={styles.ticaBadge}
            />
          </View>

          <Text style={styles.breedOrigin}>📍 {item.origin}</Text>

          <View style={styles.breedDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Coat:</Text>
              <Text style={styles.detailValue}>{item.coat_length}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Activity:</Text>
              <Badge 
                text={item.activity_level} 
                variant={getActivityLevelColor(item.activity_level) as any}
                size="sm"
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              ⏰ {getLifespanString(item)}
            </Text>
            <Text style={styles.statText}>
              ⚖️ {getWeightRangeString(item)}
            </Text>
          </View>

          <Text style={styles.breedTemperament} numberOfLines={2}>
            {item.temperament}
          </Text>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <Text style={styles.emptyStateEmoji}>💔</Text>
        <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
        <Text style={styles.emptyStateText}>
          Start exploring cat breeds and tap the heart icon to save your favorites here!
        </Text>
        <Button
          title="Explore Breeds"
          onPress={handleExploreBreeds}
          variant="primary"
          size="lg"
          leftIcon={<Text style={styles.buttonIcon}>🔍</Text>}
          style={styles.exploreButton}
        />
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.screenTitle}>My Favorites</Text>
      {favorites.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.favoritesCount}>
            {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.statsText}>
            {favorites.length === 1 
              ? 'You have one favorite breed' 
              : `You've collected ${favorites.length} favorite breeds`
            }
          </Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your favorites...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😿</Text>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={handleRetry}
          variant="primary"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      {renderHeader()}

      {/* Favorites List */}
      <FlatList
        data={favorites}
        renderItem={renderBreed}
        keyExtractor={(item) => item.id?.toString() || item.tica_code}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={favorites.length === 0 ? styles.emptyContainer : styles.listContainer}
        numColumns={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header
  headerSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  screenTitle: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  statsContainer: {
    alignItems: 'center',
  },
  favoritesCount: {
    fontSize: Typography.fontSize.lg,
    color: Colors.error,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  statsText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  errorTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  
  // Breed Cards
  breedCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  breedCardContent: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
  },
  breedImage: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.md,
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  breedInfo: {
    flex: 1,
    paddingLeft: Spacing.lg,
    justifyContent: 'space-between',
  },
  breedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  breedName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  ticaBadge: {
    marginLeft: Spacing.sm,
  },
  breedOrigin: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  breedDetails: {
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    minWidth: 50,
  },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  statText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  breedTemperament: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.relaxed,
    fontStyle: 'italic',
  },
  
  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyStateContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyStateEmoji: {
    fontSize: 80,
    marginBottom: Spacing.xl,
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    marginBottom: Spacing.xl,
  },
  exploreButton: {
    marginTop: Spacing.md,
  },
  buttonIcon: {
    fontSize: Typography.fontSize.lg,
  },
  
  // List Containers
  emptyContainer: {
    flexGrow: 1,
  },
  listContainer: {
    paddingBottom: Spacing.xxxl,
  },
});