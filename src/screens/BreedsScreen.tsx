// src/screens/BreedsScreen.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed, BreedFilter, getLifespanString, getWeightRangeString } from '../types/CatBreed';
import { RootStackParamList } from '../types/navigation';
import { FilterDropdown } from '../components/FilterDropdown';
import { SortDropdown, SortOption } from '../components/SortDropdown';
import { AnimatedHeart } from '../components/AnimatedHeart';
import { SearchBar } from '../components/common/SearchBar';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { catImages } from '../assets/catPhotos/imageMap';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

type BreedsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BreedsList'>;

interface Props {
  navigation: BreedsScreenNavigationProp;
}

export default function BreedsScreen({ navigation }: Props) {
  // Database context
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
    isFavorite
  } = useDatabase();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBreeds, setFilteredBreeds] = useState<CatBreed[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedCoatLength, setSelectedCoatLength] = useState('');
  const [selectedActivityLevel, setSelectedActivityLevel] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Filter options
  const filterOptions = useMemo(() => getFilterOptions(), [breeds]);

  // Check if any filters are active
  const hasActiveFilters = selectedOrigin || selectedCoatLength || selectedActivityLevel || searchQuery;

  // Search and filter logic
  useEffect(() => {
    let result = breeds;

    // Apply search query
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

  // Load search history
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && query.length > 2) {
      addToSearchHistory(query.trim());
      loadSearchHistory();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedOrigin('');
    setSelectedCoatLength('');
    setSelectedActivityLevel('');
  };

  const handleBreedPress = (breed: CatBreed) => {
    navigation.navigate('BreedDetail', { breed, breedId: breed.id });
  };

  const handleFavoritePress = async (breed: CatBreed, event: any) => {
    event.stopPropagation();
    if (breed.id) {
      await toggleFavorite(breed.id);
    }
  };

  const getActivityLevelColor = (level: string): 'success' | 'warning' | 'accent' | 'secondary' | 'error' | 'primary' => {
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
              showBackground={true}
              size="sm"
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
              variant="primary" 
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
                variant={getActivityLevelColor(item.activity_level)}
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
      <Text style={styles.emptyStateEmoji}>😿</Text>
      <Text style={styles.emptyStateTitle}>
        {hasActiveFilters ? 'No Matching Breeds' : 'No Breeds Found'}
      </Text>
      <Text style={styles.emptyStateText}>
        {hasActiveFilters 
          ? 'Try adjusting your search criteria or filters to find more breeds.'
          : 'There was an issue loading the breed data. Please try again later.'
        }
      </Text>
      {hasActiveFilters && (
        <Button
          title="Clear All Filters"
          onPress={clearAllFilters}
          variant="outline"
          style={styles.clearFiltersButton}
        />
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.screenTitle}>Discover Cat Breeds</Text>
      <Text style={styles.screenSubtitle}>
        {filteredBreeds.length} of {breeds.length} breeds
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading breeds...</Text>
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
          onPress={() => {/* Add retry logic */}}
          variant="primary"
        />
      </View>
    );
  }

  return (
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

      {/* Filter and Sort Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.filtersContainer}>
          <FilterDropdown
            title="Origin"
            options={filterOptions.origins.map(origin => ({ label: origin, value: origin }))}
            selectedValue={selectedOrigin}
            onSelect={setSelectedOrigin}
            placeholder="All"
          />
          <FilterDropdown
            title="Coat"
            options={filterOptions.coatLengths.map(length => ({ label: length, value: length }))}
            selectedValue={selectedCoatLength}
            onSelect={setSelectedCoatLength}
            placeholder="All"
          />
          <FilterDropdown
            title="Activity"
            options={filterOptions.activityLevels.map(level => ({ label: level, value: level }))}
            selectedValue={selectedActivityLevel}
            onSelect={setSelectedActivityLevel}
            placeholder="All"
          />
        </View>
        
        <SortDropdown
          selectedSort={sortBy}
          onSortChange={setSortBy}
        />
      </View>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            {filteredBreeds.length} breeds match your criteria
          </Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Breeds List */}
      <FlatList
        data={filteredBreeds}
        renderItem={renderBreed}
        keyExtractor={(item) => item.id?.toString() || item.tica_code}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={filteredBreeds.length === 0 ? styles.emptyContainer : styles.listContainer}
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
    marginBottom: Spacing.xs,
  },
  screenSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
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
  
  // Controls
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filtersContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  
  // Active Filters
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: `${Colors.primary}10`,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  activeFiltersText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  clearAllText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
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
  },
  clearFiltersButton: {
    marginTop: Spacing.md,
  },
  
  // List Containers
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listContainer: {
    paddingBottom: Spacing.xxxl,
  },
});