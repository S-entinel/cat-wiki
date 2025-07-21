import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { FilterDropdown, FilterCategory } from '../components/FilterDropdown';
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
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string | string[] }>({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadBreeds();
    }, [])
  );

  // Filter and sort breeds based on search query, filters, and sort option
  useEffect(() => {
    let filtered = breeds;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = breeds.filter(breed =>
        breed.name.toLowerCase().includes(query) ||
        breed.origin.toLowerCase().includes(query) ||
        breed.temperament.toLowerCase().includes(query) ||
        breed.activity_level.toLowerCase().includes(query) ||
        breed.coat_pattern?.toLowerCase().includes(query) ||
        breed.genetic_info?.toLowerCase().includes(query)
      );
    }

    // Apply active filters
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) return;

      filtered = filtered.filter(breed => {
        switch (filterKey) {
          case 'activity':
            return Array.isArray(filterValue) 
              ? filterValue.includes(breed.activity_level)
              : breed.activity_level === filterValue;
          case 'size':
            const getSizeCategory = (breed: CatBreed): string => {
              const avgWeight = (breed.weight_min_female + breed.weight_max_female + breed.weight_min_male + breed.weight_max_male) / 4;
              if (avgWeight < 4) return 'Small';
              if (avgWeight < 6) return 'Medium';
              return 'Large';
            };
            return Array.isArray(filterValue)
              ? filterValue.includes(getSizeCategory(breed))
              : getSizeCategory(breed) === filterValue;
          case 'grooming_needs':
            return Array.isArray(filterValue)
              ? filterValue.includes(breed.grooming_needs)
              : breed.grooming_needs === filterValue;
          case 'body_type':
            return Array.isArray(filterValue)
              ? filterValue.includes(breed.body_type)
              : breed.body_type === filterValue;
          case 'coat_length':
            return Array.isArray(filterValue)
              ? filterValue.includes(breed.coat_length)
              : breed.coat_length === filterValue;
          case 'origin':
            return Array.isArray(filterValue)
              ? filterValue.some(value => breed.origin.includes(value))
              : breed.origin.includes(filterValue as string);
          case 'coat_pattern':
            return Array.isArray(filterValue)
              ? filterValue.some(value => breed.coat_pattern?.includes(value))
              : breed.coat_pattern?.includes(filterValue as string);
          default:
            return true;
        }
      });
    });

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
  }, [breeds, searchQuery, sortBy, activeFilters]);

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

  // Memoize filter categories to prevent unnecessary re-renders
  const filterCategories = useMemo((): FilterCategory[] => {
    const getUniqueValues = (key: keyof CatBreed) => {
      const values = breeds.map(breed => breed[key]).filter(Boolean);
      const counts: { [key: string]: number } = {};
      values.forEach(value => {
        const stringValue = String(value);
        counts[stringValue] = (counts[stringValue] || 0) + 1;
      });
      return Object.entries(counts).map(([value, count]) => ({
        label: value,
        value,
        count
      }));
    };

    const getSizeCategory = (breed: CatBreed): string => {
      // Calculate average weight across genders
      const avgWeight = (breed.weight_min_female + breed.weight_max_female + breed.weight_min_male + breed.weight_max_male) / 4;
      if (avgWeight < 4) return 'Small';
      if (avgWeight < 6) return 'Medium';
      return 'Large';
    };

    const getSizeOptions = () => {
      const sizeCounts: { [key: string]: number } = {};
      breeds.forEach(breed => {
        const size = getSizeCategory(breed);
        sizeCounts[size] = (sizeCounts[size] || 0) + 1;
      });
      return [
        { label: 'Small', value: 'Small', count: sizeCounts['Small'] || 0 },
        { label: 'Medium', value: 'Medium', count: sizeCounts['Medium'] || 0 },
        { label: 'Large', value: 'Large', count: sizeCounts['Large'] || 0 }
      ];
    };

    return [
      {
        id: 'activity',
        title: 'Activity Level',
        options: getUniqueValues('activity_level').sort((a, b) => {
          const order = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High'];
          return order.indexOf(a.value) - order.indexOf(b.value);
        }),
        selectedValue: (activeFilters.activity as string) || ''
      },
      {
        id: 'size',
        title: 'Size',
        options: getSizeOptions(),
        selectedValue: (activeFilters.size as string) || ''
      },
      {
        id: 'grooming_needs',
        title: 'Grooming Needs',
        options: getUniqueValues('grooming_needs').sort((a, b) => {
          const order = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High'];
          return order.indexOf(a.value) - order.indexOf(b.value);
        }),
        selectedValue: (activeFilters.grooming_needs as string) || ''
      },
      {
        id: 'body_type',
        title: 'Body Type',
        options: getUniqueValues('body_type').sort((a, b) => {
          const order = ['Cobby', 'Semi-cobby', 'Semi-foreign', 'Foreign', 'Oriental'];
          return order.indexOf(a.value) - order.indexOf(b.value);
        }),
        selectedValue: (activeFilters.body_type as string) || ''
      },
      {
        id: 'coat_length',
        title: 'Coat Length',
        options: getUniqueValues('coat_length').sort((a, b) => {
          const order = ['Hairless', 'Short', 'Medium', 'Semi-long', 'Long'];
          return order.indexOf(a.value) - order.indexOf(b.value);
        }),
        selectedValue: (activeFilters.coat_length as string) || ''
      },
      {
        id: 'coat_pattern',
        title: 'Coat Pattern',
        options: getUniqueValues('coat_pattern'),
        selectedValue: '',
        multiSelect: true,
        selectedValues: (activeFilters.coat_pattern as string[]) || []
      }
    ];
  }, [breeds, activeFilters]);

  const handleApplyFilters = useCallback((filters: { [categoryId: string]: string | string[] }) => {
    setActiveFilters(filters);
    
    // Count active filters
    let count = 0;
    Object.values(filters).forEach(value => {
      if (Array.isArray(value)) {
        count += value.length;
      } else if (value && value !== '') {
        count += 1;
      }
    });
    
    setActiveFiltersCount(count);
  }, []);

  const handleResetFilters = useCallback(() => {
    setActiveFilters({});
    setActiveFiltersCount(0);
  }, []);

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
      
      <View style={styles.controlsRow}>
        <FilterDropdown
          categories={filterCategories}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          activeFiltersCount={activeFiltersCount}
          style={styles.filterDropdown}
        />
        
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
              showBackground={true}
            />
          </View>
          
          {/* TICA Badge - only show if available */}
          {item.tica_code && (
            <View style={styles.ticaBadgeContainer}>
              <Badge 
                text={item.tica_code} 
                variant="primary" 
                size="xs"
                style={styles.ticaBadge}
              />
            </View>
          )}
        </View>

        {/* Enhanced Content */}
        <View style={styles.breedContent}>
          <View style={styles.breedHeader}>
            <Text style={styles.breedName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          
          <Text style={styles.breedOrigin} numberOfLines={1}>
            {item.origin}
          </Text>
          
          {/* Enhanced Badge Row */}
          <View style={styles.badgeRow}>
            <Badge 
              text={item.activity_level} 
              variant={getActivityVariant(item.activity_level)}
              size="xs"
            />
            <Badge 
              text={item.coat_length} 
              variant="accent"
              size="xs"
            />
            {item.coat_pattern && (
              <Badge 
                text={item.coat_pattern} 
                variant="info"
                size="xs"
              />
            )}
          </View>
          
          {/* Personality Score Preview - if available */}
          {item.personality_scores && (
            <View style={styles.personalityPreview}>
              <Text style={styles.personalityLabel}>Personality Highlights:</Text>
              <View style={styles.personalityScores}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Energy</Text>
                  <Text style={styles.scoreValue}>{item.personality_scores.energy_level}/10</Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Friendly</Text>
                  <Text style={styles.scoreValue}>{item.personality_scores.friendliness}/10</Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Smart</Text>
                  <Text style={styles.scoreValue}>{item.personality_scores.intelligence}/10</Text>
                </View>
              </View>
            </View>
          )}
          
          {/* Brief Description */}
          <Text style={styles.breedDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </Card>
    );
  }, [isFavorite, handleBreedPress, handleFavoritePress]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No breeds match your search' : 'No breeds available'}
      </Text>
      <Text style={styles.emptyText}>
        {searchQuery 
          ? 'Try adjusting your search terms or browse all available breeds'
          : 'Check your connection and try refreshing the list'
        }
      </Text>
      {!searchQuery && (
        <Button
          title="Refresh"
          onPress={handleRefresh}
          variant="primary"
          size="lg"
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
        <Text style={styles.errorTitle}>Unable to load breeds</Text>
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
      
      {/* Fixed SearchBar outside of FlatList */}
      <View style={styles.searchBarContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search cat breeds..."
        />
      </View>
      
      <FlatList
        data={filteredBreeds}
        renderItem={renderBreed}
        keyExtractor={(item) => item.id?.toString() || item.name}
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
  
  searchBarContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
  },
  
  list: {
    flex: 1,
  },
  
  listContainer: {
    paddingHorizontal: Spacing.lg,
  },
  
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  errorTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.error,
    textAlign: 'center',
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * 1.5,
  },
  
  // Header Section
  headerSection: {
    paddingVertical: Spacing.xl,
    gap: Spacing.lg,
  },
  headerTitleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  screenTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  screenSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  
  // Controls
  controlsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  filterDropdown: {
    flex: 1,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceVariant,
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
    marginBottom: Spacing.md,
  },
  
  // Badge Row
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  // Personality Preview
  personalityPreview: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.md,
  },
  personalityLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  personalityScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  
  // Description
  breedDescription: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * 1.5,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.normal,
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: '15%',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * 1.5,
    marginBottom: Spacing.xl,
  },
  refreshButton: {
    marginTop: Spacing.lg,
  },
});