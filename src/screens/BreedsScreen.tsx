import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { catBreeds, CatBreed } from '../data/catBreeds';
import { RootStackParamList } from '../types/navigation';
import { useFavorites } from '../context/FavoritesContext';
import { FilterDropdown } from '../components/FilterDropdown';
import { SortDropdown, SortOption } from '../components/SortDropdown';
import { AnimatedHeart } from '../components/AnimatedHeart';

type BreedsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BreedsList'>;

interface Props {
  navigation: BreedsScreenNavigationProp;
}

const SEARCH_HISTORY_KEY = '@cat_app_search_history';

export default function BreedsScreen({ navigation }: Props) {
  // State for search, filters, and sort
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedTemperament, setSelectedTemperament] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Animation for the entire list
  const fadeAnim = useMemo(() => new Animated.Value(1), []);
  
  const { toggleFavorite, isFavorite } = useFavorites();

  // Load search history on component mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveSearchToHistory = async (query: string) => {
    if (!query.trim() || query.length < 2) return;
    
    try {
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  // Generate filter options from our breed data
  const originOptions = useMemo(() => {
    const uniqueOrigins = [...new Set(catBreeds.map(breed => breed.origin))];
    return uniqueOrigins.sort().map(origin => ({ label: origin, value: origin }));
  }, []);

  const temperamentOptions = useMemo(() => {
    const allTraits = catBreeds.flatMap(breed => 
      breed.temperament.split(',').map(trait => trait.trim())
    );
    const uniqueTraits = [...new Set(allTraits)];
    return uniqueTraits.sort().map(trait => ({ label: trait, value: trait }));
  }, []);

  // Helper function to parse lifespan for sorting
  const parseLifespan = (lifespan: string): number => {
    const match = lifespan.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Apply all filters and sorting
  const filteredAndSortedBreeds = useMemo(() => {
    let filtered = catBreeds;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(breed => 
        breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        breed.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        breed.temperament.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply origin filter
    if (selectedOrigin) {
      filtered = filtered.filter(breed => breed.origin === selectedOrigin);
    }

    // Apply temperament filter
    if (selectedTemperament) {
      filtered = filtered.filter(breed => 
        breed.temperament.toLowerCase().includes(selectedTemperament.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'origin':
          return a.origin.localeCompare(b.origin);
        case 'lifespan':
          return parseLifespan(b.lifespan) - parseLifespan(a.lifespan); // Descending
        case 'temperament':
          return a.temperament.localeCompare(b.temperament);
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedOrigin, selectedTemperament, sortBy]);

  // Animate when results change
  useEffect(() => {
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
  }, [filteredAndSortedBreeds.length]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedOrigin('');
    setSelectedTemperament('');
    setSortBy('name');
  };

  const hasActiveFilters = searchQuery || selectedOrigin || selectedTemperament || sortBy !== 'name';

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveSearchToHistory(searchQuery.trim());
      setShowSearchHistory(false);
    }
  };

  const handleSearchHistorySelect = (historyItem: string) => {
    setSearchQuery(historyItem);
    setShowSearchHistory(false);
  };

  const handleFavoritePress = async (breed: CatBreed, event: any) => {
    event.stopPropagation();
    await toggleFavorite(breed);
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
        onPress={() => navigation.navigate('BreedDetail', { breed: item })}
      >
        <Image 
          source={item.image} 
          style={styles.breedImage}
          resizeMode="cover"
        />
        <View style={styles.breedInfo}>
          <Text style={styles.breedName}>{item.name}</Text>
          <Text style={styles.breedOrigin}>Origin: {item.origin}</Text>
          <Text style={styles.breedTemperament} numberOfLines={2}>
            {item.temperament}
          </Text>
        </View>
        
        <AnimatedHeart
          isFavorite={isFavorite(item.id)}
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cat Breeds</Text>
      
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
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
        
        {/* Search History Dropdown */}
        {showSearchHistory && (
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
            options={originOptions}
            selectedValue={selectedOrigin}
            onSelect={setSelectedOrigin}
            placeholder="All Origins"
          />
          <FilterDropdown
            title="Temperament"
            options={temperamentOptions}
            selectedValue={selectedTemperament}
            onSelect={setSelectedTemperament}
            placeholder="All Traits"
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
            Active: 
            {searchQuery && ` Search`}
            {selectedOrigin && ` Origin`}
            {selectedTemperament && ` Temperament`}
            {sortBy !== 'name' && ` Sort`}
          </Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results count */}
      <Text style={styles.resultsCount}>
        {filteredAndSortedBreeds.length} breed{filteredAndSortedBreeds.length !== 1 ? 's' : ''} found
      </Text>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={filteredAndSortedBreeds}
          renderItem={renderBreed}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={filteredAndSortedBreeds.length === 0 ? styles.emptyContainer : undefined}
        />
      </Animated.View>
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
  searchContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
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
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchHistoryContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  searchHistoryList: {
    maxHeight: 200,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  historyIcon: {
    fontSize: 16,
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
    marginBottom: 12,
  },
  filtersContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  activeFiltersText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '500',
  },
  clearAllText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '500',
  },
  resultsCount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    textAlign: 'center',
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
  breedTemperament: {
    fontSize: 14,
    color: '#3498db',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
});