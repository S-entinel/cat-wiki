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
  Platform,
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

export default function BreedsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    breeds,
    isLoading,
    error,
    getAllBreeds,
    toggleFavorite,
    isFavorite,
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBreeds, setFilteredBreeds] = useState<CatBreed[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'activity' | 'origin'>('name');
  const [showFilters, setShowFilters] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBreeds();
    }, [])
  );

  // Filter and sort breeds based on search query and sort option
  useEffect(() => {
    let filtered = breeds;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = breeds.filter(breed =>
        breed.name.toLowerCase().includes(query) ||
        breed.origin.toLowerCase().includes(query) ||
        breed.temperament.toLowerCase().includes(query) ||
        breed.activity_level.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'activity':
          return a.activity_level.localeCompare(b.activity_level);
        case 'origin':
          return a.origin.localeCompare(b.origin);
        default:
          return 0;
      }
    });

    setFilteredBreeds(filtered);
  }, [breeds, searchQuery, sortBy]);

  const loadBreeds = async () => {
    try {
      await getAllBreeds();
    } catch (error) {
      console.error('Error loading breeds:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBreeds();
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
        <Text style={styles.screenTitle}>Cat Breed Collection</Text>
        <Text style={styles.screenSubtitle}>
          {filteredBreeds.length} of {breeds.length} breeds
          {searchQuery && ' matching your search'}
        </Text>
      </View>
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search cat breeds..."
      />
      
      <View style={styles.controlsRow}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
          <Text style={styles.filterIcon}>▼</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => {
            const nextSort = sortBy === 'name' ? 'activity' : sortBy === 'activity' ? 'origin' : 'name';
            setSortBy(nextSort);
          }}
        >
          <Text style={styles.sortButtonText}>
            Sort: {sortBy === 'name' ? 'Name' : sortBy === 'activity' ? 'Activity' : 'Origin'}
          </Text>
          <Text style={styles.sortIcon}>↕</Text>
        </TouchableOpacity>
      </View>
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
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No breeds match your search' : 'No breeds found'}
      </Text>
      <Text style={styles.emptyStateText}>
        {searchQuery 
          ? 'Try adjusting your search terms or clearing filters' 
          : 'Check your internet connection and try refreshing'
        }
      </Text>
      {!searchQuery && (
        <Button
          title="Refresh"
          onPress={handleRefresh}
          variant="primary"
          size="md"
          style={styles.refreshButton}
        />
      )}
    </View>
  );

  if (isLoading && breeds.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading cat breeds...</Text>
      </View>
    );
  }

  if (error && breeds.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
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
        data={filteredBreeds}
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
  
  // Controls
  controlsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  filterButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  filterIcon: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  sortButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  sortIcon: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
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
  
  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '8%',
    paddingVertical: '15%',
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
  refreshButton: {
    marginTop: Spacing.lg,
  },
});