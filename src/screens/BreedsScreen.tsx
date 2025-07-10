import React, { useState, useMemo, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Animated,
  ActivityIndicator,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed, BreedFilter, getLifespanString, getWeightRangeString } from '../types/CatBreed';
import { RootStackParamList } from '../types/navigation';
import { FilterDropdown } from '../components/FilterDropdown';
import { SortDropdown, SortOption } from '../components/SortDropdown';
import { AnimatedHeart } from '../components/AnimatedHeart';

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
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    origins: [] as string[],
    coatLengths: [] as string[],
    activityLevels: [] as string[],
    bodyTypes: [] as string[]
  });

  // Animation for the list
  const fadeAnim = useMemo(() => new Animated.Value(1), []);

  // Load filter options and search history on mount
  useEffect(() => {
    loadFilterOptions();
    loadSearchHistory();
  }, []);

  // Update filtered breeds when data changes
  useEffect(() => {
    if (!isLoading && breeds.length > 0) {
      applyFiltersAndSort();
    }
  }, [breeds, searchQuery, selectedOrigin, selectedCoatLength, selectedActivityLevel, sortBy, isLoading]);

  const loadFilterOptions = async () => {
    try {
      const options = await getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (err) {
      console.error('Error loading search history:', err);
    }
  };

  const applyFiltersAndSort = async () => {
    try {
      setIsSearching(true);

      const filter: BreedFilter = {
        searchQuery: searchQuery.trim() || undefined,
        origin: selectedOrigin || undefined,
        coatLength: selectedCoatLength as any || undefined,
        activityLevel: selectedActivityLevel as any || undefined
      };

      let results = await filterBreeds(filter);

      // Apply sorting
      results = [...results].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'origin':
            return a.origin.localeCompare(b.origin);
          case 'lifespan':
            return b.lifespan_max - a.lifespan_max; // Descending
          case 'temperament':
            return a.temperament.localeCompare(b.temperament);
          default:
            return 0;
        }
      });

      setFilteredBreeds(results);

      // Animate results change
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

    } catch (err) {
      console.error('Error applying filters:', err);
      Alert.alert('Error', 'Failed to filter breeds');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = async () => {
    if (searchQuery.trim()) {
      await addToSearchHistory(searchQuery.trim());
      await loadSearchHistory();
      setShowSearchHistory(false);
    }
  };

  const handleSearchHistorySelect = (historyItem: string) => {
    setSearchQuery(historyItem);
    setShowSearchHistory(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedOrigin('');
    setSelectedCoatLength('');
    setSelectedActivityLevel('');
    setSortBy('name');
  };

  const hasActiveFilters = searchQuery || selectedOrigin || selectedCoatLength || selectedActivityLevel || sortBy !== 'name';

  const handleFavoritePress = async (breed: CatBreed, event: any) => {
    event.stopPropagation();
    if (breed.id) {
      await toggleFavorite(breed.id);
    }
  };

  const handleBreedPress = (breed: CatBreed) => {
    navigation.navigate('BreedDetail', { 
      breed, 
      breedId: breed.id 
    });
  };

  const renderBreed = ({ item, index }: { item: CatBreed; index: number }) => (
    <Animated.View
      style={[
        styles.breedCardContainer,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            })
          }]
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.breedCard}
        onPress={() => handleBreedPress(item)}
      >
        <Image 
          source={{ uri: `${item.image_path}` }}
          style={styles.breedImage}
          resizeMode="cover"
          defaultSource={require('../assets/catPhotos/placeholder.jpg')}
        />
        <View style={styles.breedInfo}>
          <Text style={styles.breedName}>{item.name}</Text>
          <Text style={styles.breedOrigin}>Origin: {item.origin}</Text>
          <Text style={styles.breedDetails}>
            {item.coat_length} • {item.activity_level} Activity
          </Text>
          <Text style={styles.breedLifespan}>
            Lifespan: {getLifespanString(item)}
          </Text>
          <Text style={styles.breedTemperament} numberOfLines={2}>
            {item.temperament}
          </Text>
        </View>
        
        <AnimatedHeart
          isFavorite={item.id ? isFavorite(item.id) : false}
          onPress={() => handleFavoritePress(item, { stopPropagation: () => {} })}
        />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSearchHistoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => handleSearchHistorySelect(item)}
    >
      <Text style={styles.historyIcon}>🕐</Text>
      <Text style={styles.historyText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {hasActiveFilters 
          ? 'No breeds match your current filters' 
          : 'No breeds available'
        }
      </Text>
      {hasActiveFilters && (
        <TouchableOpacity 
          style={styles.clearFiltersButton}
          onPress={clearAllFilters}
        >
          <Text style={styles.clearFiltersText}>Clear All Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading cat breeds...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>😿 {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cat Breeds ({filteredBreeds.length})</Text>
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search breeds, origins, or temperaments..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          onFocus={() => setShowSearchHistory(searchHistory.length > 0)}
          onBlur={() => setTimeout(() => setShowSearchHistory(false), 150)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {(searchQuery.length > 0 || isSearching) && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
            disabled={isSearching}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color="#7f8c8d" />
            ) : (
              <Text style={styles.clearButtonText}>✕</Text>
            )}
          </TouchableOpacity>
        )}
        
        {/* Search History Dropdown */}
        {showSearchHistory && searchHistory.length > 0 && (
          <View style={styles.searchHistoryContainer}>
            <FlatList
              data={searchHistory}
              renderItem={renderSearchHistoryItem}
              keyExtractor={(item, index) => `${item}-${index}`}
              style={styles.searchHistoryList}
            />
          </View>
        )}
      </View>

      {/* Filter and Sort Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.filtersContainer}>
          <FilterDropdown
            title="Origin"
            options={filterOptions.origins.map(origin => ({ label: origin, value: origin }))}
            selectedValue={selectedOrigin}
            onSelect={setSelectedOrigin}
            placeholder="All Origins"
          />
          <FilterDropdown
            title="Coat"
            options={filterOptions.coatLengths.map(length => ({ label: length, value: length }))}
            selectedValue={selectedCoatLength}
            onSelect={setSelectedCoatLength}
            placeholder="All Coats"
          />
          <FilterDropdown
            title="Activity"
            options={filterOptions.activityLevels.map(level => ({ label: level, value: level }))}
            selectedValue={selectedActivityLevel}
            onSelect={setSelectedActivityLevel}
            placeholder="All Levels"
          />
        </View>
        
        <SortDropdown
          selectedSort={sortBy}
          onSortChange={setSortBy}
        />
      </View>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <TouchableOpacity 
          style={styles.clearAllFiltersButton}
          onPress={clearAllFilters}
        >
          <Text style={styles.clearAllFiltersText}>Clear All Filters</Text>
        </TouchableOpacity>
      )}

      {/* Breeds List */}
      <FlatList
        data={filteredBreeds}
        renderItem={renderBreed}
        keyExtractor={(item) => item.id?.toString() || item.tica_code}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={filteredBreeds.length === 0 ? styles.emptyContainer : styles.listContainer}
        refreshing={isSearching}
        onRefresh={applyFiltersAndSort}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  searchHistoryContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  searchHistoryList: {
    maxHeight: 150,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  historyIcon: {
    fontSize: 14,
    marginRight: 8,
    color: '#7f8c8d',
  },
  historyText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  clearAllFiltersButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'center',
  },
  clearAllFiltersText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  breedCardContainer: {
    marginBottom: 12,
  },
  breedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breedImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  breedInfo: {
    flex: 1,
  },
  breedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  breedOrigin: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  breedDetails: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 2,
  },
  breedLifespan: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 4,
  },
  breedTemperament: {
    fontSize: 14,
    color: '#3498db',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
});