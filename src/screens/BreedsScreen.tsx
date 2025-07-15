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

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = Spacing.md;
const CARD_WIDTH = screenWidth - (CARD_MARGIN * 2);

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

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = breeds.filter(breed =>
        breed.name.toLowerCase().includes(query) ||
        breed.origin.toLowerCase().includes(query) ||
        breed.temperament.toLowerCase().includes(query) ||
        breed.coat_pattern?.toLowerCase().includes(query) ||
        breed.activity_level.toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'origin':
          return a.origin.localeCompare(b.origin);
        case 'activity':
          return a.activity_level.localeCompare(b.activity_level);
        default:
          return a.name.localeCompare(b.name);
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
    navigation.navigate('BreedDetail', { breed });
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
        <Text style={styles.screenTitle}>Breed Collection</Text>
        <Text style={styles.screenSubtitle}>
          {filteredBreeds.length} of {breeds.length} breeds
          {searchQuery && ' matching your search'}
        </Text>
      </View>
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search breeds..."
      />
      
      <View style={styles.controlsRow}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
          <Text style={styles.filterIcon}>🔽</Text>
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
          <Text style={styles.sortIcon}>🔄</Text>
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
        shadow="md"
        pressable
        onPress={() => handleBreedPress(item)}
        style={styles.breedCard}
      >
        <View style={styles.breedImageContainer}>
          <Image 
            source={imageSource}
            style={styles.breedImage}
            resizeMode="cover"
          />
          
          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleFavoritePress(item.id!)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AnimatedHeart
              isFavorite={isFavorite(item.id!)}
              onPress={() => handleFavoritePress(item.id!)}
              size="md"
              showBackground
            />
          </TouchableOpacity>
        </View>
        
        {/* Breed Info */}
        <View style={styles.breedContent}>
          <View style={styles.breedHeader}>
            <Text style={styles.breedName} numberOfLines={1}>
              {item.name}
            </Text>
            <Badge 
              text={item.tica_code} 
              variant="primary" 
              size="xs" 
              style={styles.ticaBadge} 
            />
          </View>
          
          <Text style={styles.breedOrigin} numberOfLines={1}>
            📍 {item.origin}
          </Text>
          
          {/* Stats Row */}
          <View style={styles.breedStats}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Activity</Text>
                <Text style={styles.statValue}>{item.activity_level}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Coat</Text>
                <Text style={styles.statValue}>{item.coat_length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Lifespan</Text>
                <Text style={styles.statValue}>{item.lifespan_min}-{item.lifespan_max}y</Text>
              </View>
            </View>
          </View>

          {/* Temperament Tags */}
          <View style={styles.temperamentContainer}>
            {item.temperament.split(',').slice(0, 3).map((temperament, index) => (
              <Badge
                key={index}
                text={temperament.trim()}
                variant="accent"
                size="xs"
                outlined
                style={styles.temperamentTag}
              />
            ))}
          </View>
        </View>
      </Card>
    );
  }, [handleBreedPress, handleFavoritePress, isFavorite]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🐱</Text>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No breeds found' : 'No breeds available'}
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
        <Text style={styles.loadingText}>Loading breeds...</Text>
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
  
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
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
    paddingHorizontal: Spacing.lg,
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
  
  // List
  list: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
  },
  
  // Header
  headerSection: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitleContainer: {
    marginBottom: Spacing.lg,
  },
  screenTitle: {
    fontSize: Typography.fontSize.xxl,
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
    marginTop: Spacing.md,
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
  },
  filterButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  filterIcon: {
    fontSize: Typography.fontSize.sm,
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
  },
  sortButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  sortIcon: {
    fontSize: Typography.fontSize.sm,
  },
  
  // Breed Cards
  breedCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  breedImageContainer: {
    position: 'relative',
    height: 200,
  },
  breedImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceVariant,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  
  breedContent: {
    padding: Spacing.lg,
  },
  breedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  breedName: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  ticaBadge: {
    marginLeft: Spacing.sm,
  },
  breedOrigin: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
  },
  
  breedStats: {
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  statValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
  },
  
  temperamentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  temperamentTag: {
    marginRight: 0,
    marginBottom: 0,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxxl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: Typography.fontSize.base * 1.4,
  },
  refreshButton: {
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
});