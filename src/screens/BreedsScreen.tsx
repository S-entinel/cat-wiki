
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed, BreedFilter } from '../types/CatBreed';
import { FilterDropdown } from '../components/FilterDropdown';
import { SortDropdown, SortOption } from '../components/SortDropdown';
import { AnimatedHeart } from '../components/AnimatedHeart';
import { SearchBar } from '../components/common/SearchBar';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { catImages } from '../assets/catPhotos/imageMap';
import { 
  Colors, 
  Typography, 
  Spacing, 
  BorderRadius, 
  Layout,
  Shadows
} from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export default function BreedsScreen() {
  const navigation = useNavigation();
  const {
    breeds,
    isLoading,
    error,
    searchBreeds,
    filterBreeds,
    getSearchHistory,
    addToSearchHistory,
    getFilterOptions,
    toggleFavorite,
    isFavorite,
    getAllBreeds
  } = useDatabase();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBreeds, setFilteredBreeds] = useState<CatBreed[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedCoatLength, setSelectedCoatLength] = useState('');
  const [selectedActivityLevel, setSelectedActivityLevel] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const filterOptions = useMemo(() => getFilterOptions(), [breeds]);

  // Check if any filters are active
  const hasActiveFilters = selectedOrigin || selectedCoatLength || selectedActivityLevel || searchQuery;
  const activeFilterCount = [selectedOrigin, selectedCoatLength, selectedActivityLevel, searchQuery].filter(Boolean).length;

  // Search and filter logic
  useEffect(() => {
    let result = breeds;

    // Apply search query first
    if (searchQuery.trim()) {
      result = searchBreeds(searchQuery.trim());
    }

    // Apply filters
    const filter: BreedFilter = {
      origin: selectedOrigin || undefined,
      coatLength: selectedCoatLength as any,
      activityLevel: selectedActivityLevel as any,
    };

    if (selectedOrigin || selectedCoatLength || selectedActivityLevel) {
      result = filterBreeds(filter, result);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'origin':
          return a.origin.localeCompare(b.origin);
        case 'lifespan':
          return (b.lifespan_min + b.lifespan_max) - (a.lifespan_min + a.lifespan_max);
        case 'temperament':
          return a.temperament.localeCompare(b.temperament);
        default:
          return 0;
      }
    });

    setFilteredBreeds(result);
  }, [breeds, searchQuery, selectedOrigin, selectedCoatLength, selectedActivityLevel, sortBy, searchBreeds, filterBreeds]);

  // Handlers
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim() && query.length > 2) {
      try {
        await addToSearchHistory(query.trim());
      } catch (error) {
        console.error('Error adding to search history:', error);
      }
    }
  }, [addToSearchHistory]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedOrigin('');
    setSelectedCoatLength('');
    setSelectedActivityLevel('');
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getAllBreeds();
    } catch (error) {
      console.error('Error refreshing breeds:', error);
    } finally {
      setRefreshing(false);
    }
  }, [getAllBreeds]);

  const handleBreedPress = useCallback((breed: CatBreed) => {
    // @ts-ignore
    navigation.navigate('BreedDetail', { breed, breedId: breed.id });
  }, [navigation]);

  const handleFavoritePress = useCallback(async (breedId: number) => {
    try {
      await toggleFavorite(breedId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [toggleFavorite]);

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

  // Render functions
  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.screenTitle}>Discover Cat Breeds</Text>
      <Text style={styles.screenSubtitle}>
        {filteredBreeds.length} of {breeds.length} breeds
      </Text>
    </View>
  );

  const renderFiltersSection = () => (
    <View style={styles.filtersSection}>
      {/* Filter Toggle Button */}
      <View style={styles.filterHeader}>
        <TouchableOpacity 
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleText}>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Text>
          <Text style={styles.filterToggleIcon}>
            {showFilters ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        <SortDropdown
          selectedSort={sortBy}
          onSortChange={setSortBy}
        />
      </View>

      {/* Expandable Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersRow}>
            <FilterDropdown
              title="Origin"
              options={filterOptions.origins.map(origin => ({ label: origin, value: origin }))}
              selectedValue={selectedOrigin}
              onSelect={setSelectedOrigin}
              placeholder="All"
              style={styles.filterDropdown}
            />
            <FilterDropdown
              title="Coat"
              options={filterOptions.coatLengths.map(length => ({ label: length, value: length }))}
              selectedValue={selectedCoatLength}
              onSelect={setSelectedCoatLength}
              placeholder="All"
              style={styles.filterDropdown}
            />
          </View>
          
          <View style={styles.filtersRow}>
            <FilterDropdown
              title="Activity"
              options={filterOptions.activityLevels.map(level => ({ label: level, value: level }))}
              selectedValue={selectedActivityLevel}
              onSelect={setSelectedActivityLevel}
              placeholder="All"
              style={styles.filterDropdown}
            />
            
            {hasActiveFilters && (
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            {filteredBreeds.length} breeds match your criteria
          </Text>
          {activeFilterCount > 1 && (
            <TouchableOpacity onPress={clearAllFilters}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const renderBreed = useCallback(({ item }: { item: CatBreed }) => {
    const imageSource = catImages[item.tica_code as keyof typeof catImages];
    
    return (
      <Card
        variant="elevated"
        padding="none"
        margin="md"
        shadow="sm"
        pressable
        onPress={() => handleBreedPress(item)}
        style={styles.breedCard}
      >
        {/* Image Section */}
        <View style={styles.breedImageContainer}>
          <Image 
            source={imageSource || { uri: item.image_path }}
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
          
          {/* TICA Code Badge */}
          <View style={styles.ticaBadge}>
            <Text style={styles.ticaCode}>{item.tica_code}</Text>
          </View>
        </View>
        
        {/* Content Section */}
        <View style={styles.breedContent}>
          {/* Header */}
          <View style={styles.breedHeader}>
            <Text style={styles.breedName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.breedOrigin}>
              <Text style={styles.originEmoji}>📍</Text>
              <Text style={styles.originText} numberOfLines={1}>
                {item.origin}
              </Text>
            </View>
          </View>
          
          {/* Details Row */}
          <View style={styles.breedDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Coat:</Text>
              <Text style={styles.detailValue}>{item.coat_length}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Activity:</Text>
              <Badge 
                text={item.activity_level} 
                variant={getActivityVariant(item.activity_level)}
                size="sm"
              />
            </View>
          </View>
          
          {/* Stats Row */}
          <View style={styles.breedStats}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⏰</Text>
              <Text style={styles.statText}>
                {item.lifespan_min}-{item.lifespan_max} years
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⚖️</Text>
              <Text style={styles.statText}>
                {item.weight_min_female}-{item.weight_max_male} kg
              </Text>
            </View>
          </View>
          
          {/* Temperament */}
          <Text style={styles.breedTemperament} numberOfLines={2}>
            {item.temperament}
          </Text>
        </View>
      </Card>
    );
  }, [handleBreedPress, handleFavoritePress, isFavorite]);

  const renderEmptyState = () => {
    if (hasActiveFilters) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateEmoji}>🔍</Text>
          <Text style={styles.emptyStateTitle}>No breeds found</Text>
          <Text style={styles.emptyStateText}>
            No cat breeds match your current search and filter criteria. Try adjusting your filters or search terms.
          </Text>
          <Button
            title="Clear Filters"
            onPress={clearAllFilters}
            variant="primary"
            style={styles.clearFiltersButtonLarge}
          />
        </View>
      );
    }

    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateEmoji}>😸</Text>
        <Text style={styles.emptyStateTitle}>No breeds available</Text>
        <Text style={styles.emptyStateText}>
          There are no cat breeds in the database yet. Pull down to refresh and try again.
        </Text>
        <Button
          title="Refresh"
          onPress={handleRefresh}
          variant="primary"
          style={styles.refreshButton}
        />
      </View>
    );
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading cat breeds...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.emptyStateEmoji}>😿</Text>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorText}>{error}</Text>
      <Button
        title="Try Again"
        onPress={handleRefresh}
        variant="primary"
        style={styles.retryButton}
      />
    </View>
  );

  // Main render
  if (isLoading && breeds.length === 0) {
    return renderLoadingState();
  }

  if (error && breeds.length === 0) {
    return renderErrorState();
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        {/* Header */}
        {renderHeader()}

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={clearSearch}
          placeholder="Search breeds..."
        />

        {/* Filters Section */}
        {renderFiltersSection()}

        {/* Breeds List */}
        <FlatList
          data={filteredBreeds}
          renderItem={renderBreed}
          keyExtractor={(item) => item.id?.toString() || item.tica_code}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={filteredBreeds.length === 0 ? styles.emptyContainer : styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header
  headerSection: {
    paddingHorizontal: Layout.content.paddingHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
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
  
  // Filters Section
  filtersSection: {
    paddingHorizontal: Layout.content.paddingHorizontal,
    marginBottom: Spacing.md,
  },
  
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    minHeight: 44,
  },
  
  filterToggleText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  
  filterToggleIcon: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  
  filtersContainer: {
    gap: Spacing.md,
  },
  
  filtersRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-end',
  },
  
  filterDropdown: {
    flex: 1,
  },
  
  clearFiltersButton: {
    backgroundColor: Colors.errorSoft,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  
  clearFiltersText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.error,
  },
  
  // Active Filters
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.infoSoft,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  
  activeFiltersText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.info,
    fontWeight: Typography.fontWeight.medium,
  },
  
  clearAllText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.info,
    fontWeight: Typography.fontWeight.bold,
  },
  
  // Breed Cards
  breedCard: {
    overflow: 'hidden',
  },
  
  breedImageContainer: {
    position: 'relative',
    height: 200,
  },
  
  breedImage: {
    width: '100%',
    height: '100%',
  },
  
  favoriteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  
  ticaBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  
  ticaCode: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
  },
  
  breedContent: {
    padding: Spacing.lg,
  },
  
  breedHeader: {
    marginBottom: Spacing.md,
  },
  
  breedName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  
  breedOrigin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  originEmoji: {
    fontSize: Typography.fontSize.sm,
    marginRight: Spacing.xs,
  },
  
  originText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  breedDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginRight: Spacing.xs,
  },
  
  detailValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  
  breedStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  statEmoji: {
    fontSize: Typography.fontSize.sm,
    marginRight: Spacing.xs,
  },
  
  statText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  breedTemperament: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    fontStyle: 'italic',
  },
  
  // Loading States
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
  
  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.content.paddingHorizontal,
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
  
  retryButton: {
    minWidth: 120,
  },
  
  // Empty States
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
    paddingHorizontal: Layout.content.paddingHorizontal,
    flex: 1,
  },
  
  emptyStateEmoji: {
    fontSize: 80,
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
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  
  clearFiltersButtonLarge: {
    minWidth: 140,
  },
  
  refreshButton: {
    minWidth: 100,
  },
  
  // List Containers
  emptyContainer: {
    flexGrow: 1,
  },
  
  listContainer: {
    paddingBottom: Layout.tabBar.heightSafe,
  },
});