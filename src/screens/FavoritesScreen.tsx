import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed } from '../types/CatBreed';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SearchBar } from '../components/common/SearchBar';
import { AnimatedHeart } from '../components/AnimatedHeart';
import { catImages } from '../assets/catPhotos/imageMap';
import { 
  Colors, 
  Typography, 
  Spacing, 
  BorderRadius, 
  Shadows
} from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    favorites,
    isLoading,
    error,
    getFavorites,
    toggleFavorite,
    isFavorite,
  } = useDatabase();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState<CatBreed[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Filter favorites based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = favorites.filter(breed =>
        breed.name.toLowerCase().includes(query) ||
        breed.origin.toLowerCase().includes(query) ||
        breed.temperament.toLowerCase().includes(query) ||
        breed.activity_level.toLowerCase().includes(query)
      );
      setFilteredFavorites(filtered);
    } else {
      setFilteredFavorites(favorites);
    }
  }, [favorites, searchQuery]);

  const loadFavorites = async () => {
    try {
      await getFavorites();
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleBreedPress = useCallback((breed: CatBreed) => {
    // @ts-ignore - Navigation types
    navigation.navigate('Breeds', {
      screen: 'BreedDetail',
      params: { breed }
    });
  }, [navigation]);

  const handleFavoritePress = useCallback(async (breedId: number) => {
    try {
      await toggleFavorite(breedId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [toggleFavorite]);

  const navigateToBreeds = useCallback(() => {
    // @ts-ignore - Navigation types
    navigation.navigate('Breeds');
  }, [navigation]);

  const getImageSource = (breed: CatBreed) => {
    // Try image_path first (should be the filename like 'abyssinian.jpg')
    if (breed.image_path && catImages[breed.image_path as keyof typeof catImages]) {
      return catImages[breed.image_path as keyof typeof catImages];
    }
    
    // Try name-based key as fallback (convert "Abyssinian" -> "abyssinian.jpg")
    const nameBasedKey = `${breed.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    if (catImages[nameBasedKey as keyof typeof catImages]) {
      return catImages[nameBasedKey as keyof typeof catImages];
    }
    
    // Fallback to placeholder
    return catImages['placeholder.jpg'];
  };

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

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.screenTitle}>Your Favorite Cats</Text>
        <Text style={styles.screenSubtitle}>
          {filteredFavorites.length} of {favorites.length} saved breeds
          {searchQuery && ' matching your search'}
        </Text>
      </View>
      
      {favorites.length > 0 && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search your favorites..."
        />
      )}
    </View>
  );

  const renderBreed = useCallback(({ item }: { item: CatBreed }) => {
    const imageSource = getImageSource(item);
    
    return (
      <Card
        variant="elevated"
        padding="none"
        margin="none"
        shadow="lg"
        pressable
        onPress={() => handleBreedPress(item)}
        style={styles.breedCard}
      >
        {/* Enhanced Image Container */}
        <View style={styles.breedImageContainer}>
          <Image 
            source={imageSource}
            style={styles.breedImage}
            resizeMode="cover"
          />
          
          {/* Subtle gradient overlay for better text readability */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)']}
            style={styles.imageOverlay}
          />
          
          {/* Enhanced Favorite Button */}
          <View style={styles.favoriteButton}>
            <AnimatedHeart
              isFavorite={isFavorite(item.id!)}
              onPress={() => handleFavoritePress(item.id!)}
              size="md"
              showBackground
            />
          </View>
          
          {/* TICA Code Badge on Image */}
          <View style={styles.ticaBadgeContainer}>
            <Badge 
              text={item.tica_code} 
              variant="primary" 
              size="xs" 
              style={styles.ticaBadge} 
            />
          </View>
        </View>
        
        {/* Enhanced Content Section */}
        <View style={styles.breedContent}>
          <View style={styles.breedHeader}>
            <Text style={styles.breedName} numberOfLines={1}>
              {item.name}
            </Text>
            <Badge
              text={item.activity_level}
              variant={getActivityVariant(item.activity_level)}
              size="xs"
            />
          </View>
          
          <Text style={styles.breedOrigin} numberOfLines={1}>
            {item.origin}
          </Text>
          
          {/* Enhanced Stats Row */}
          <View style={styles.breedStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Coat</Text>
              <Text style={styles.statValue}>{item.coat_length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Lifespan</Text>
              <Text style={styles.statValue}>{item.lifespan_min}-{item.lifespan_max}y</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Body</Text>
              <Text style={styles.statValue}>{item.body_type}</Text>
            </View>
          </View>

          {/* Enhanced Temperament Preview */}
          <View style={styles.temperamentContainer}>
            {item.temperament.split(',').slice(0, 2).map((temperament, index) => (
              <Badge
                key={index}
                text={temperament.trim()}
                variant="accent"
                size="xs"
                outlined
                style={styles.temperamentTag}
              />
            ))}
            {item.temperament.split(',').length > 2 && (
              <Text style={styles.moreTemperaments}>
                +{item.temperament.split(',').length - 2} more
              </Text>
            )}
          </View>
        </View>
      </Card>
    );
  }, [handleBreedPress, handleFavoritePress, isFavorite]);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateIcon}>♥</Text>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No favorites match your search' : 'No favorites yet'}
      </Text>
      <Text style={styles.emptyStateText}>
        {searchQuery 
          ? 'Try adjusting your search terms to find your favorite breeds'
          : 'Start exploring cat breeds and tap the heart icon to save your favorites here!'
        }
      </Text>
      {!searchQuery && (
        <Button
          title="Discover Cat Breeds"
          onPress={navigateToBreeds}
          variant="primary"
          size="lg"
          style={styles.actionButton}
        />
      )}
    </View>
  );

  if (isLoading && favorites.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your favorites...</Text>
      </View>
    );
  }

  if (error && favorites.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Unable to load favorites</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={handleRefresh}
          variant="primary"
          size="lg"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <FlatList
        data={filteredFavorites}
        renderItem={renderBreed}
        keyExtractor={(item) => item.id?.toString() || item.tica_code}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 80 }
        ]}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  list: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
  },
  
  // Loading States
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
  
  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: '8%',
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
    lineHeight: Typography.fontSize.base * 1.5,
  },
  
  // Header Section
  headerSection: {
    paddingHorizontal: '5%',
    paddingTop: Spacing.lg,
    paddingBottom: '6%',
    backgroundColor: Colors.background,
  },
  headerTitleContainer: {
    marginBottom: Spacing.xl,
  },
  screenTitle: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  screenSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Enhanced Breed Cards
  breedCard: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: '6%',
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  
  // Enhanced Image Container
  breedImageContainer: {
    position: 'relative',
    height: screenHeight * 0.28, // 28% of screen height
  },
  breedImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceVariant,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%', // 25% of image height
  },
  
  // Enhanced Favorite Button
  favoriteButton: {
    position: 'absolute',
    top: '8%',
    right: '6%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    ...Shadows.md,
  },
  
  // TICA Badge on Image
  ticaBadgeContainer: {
    position: 'absolute',
    top: '8%',
    left: '6%',
  },
  ticaBadge: {
    backgroundColor: Colors.primary,
  },
  
  // Enhanced Content
  breedContent: {
    padding: '5%',
  },
  breedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  breedName: {
    flex: 1,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
  },
  breedOrigin: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.lg,
  },
  
  // Enhanced Stats
  breedStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    padding: '4%',
    marginBottom: '5%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.border,
    marginHorizontal: '3%',
  },

  // Enhanced Temperament
  temperamentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  temperamentTag: {
    marginRight: 0,
    marginBottom: 0,
  },
  moreTemperaments: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    fontStyle: 'italic',
  },
  
  // Enhanced Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '8%',
    paddingVertical: '15%',
  },
  emptyStateIcon: {
    fontSize: 64,
    color: Colors.textTertiary,
    marginBottom: Spacing.xl,
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.fontSize.base * 1.5,
  },
  actionButton: {
    marginTop: Spacing.lg,
    minWidth: '60%',
  },
});