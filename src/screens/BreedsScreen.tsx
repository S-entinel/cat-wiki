import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { catBreeds, CatBreed } from '../data/catBreeds';
import { RootStackParamList } from '../types/navigation';
import { useFavorites } from '../hooks/useFavorites';

type BreedsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BreedsList'>;

interface Props {
  navigation: BreedsScreenNavigationProp;
}

export default function BreedsScreen({ navigation }: Props) {
  // State to hold our search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use our custom favorites hook
  const { toggleFavorite, isFavorite } = useFavorites();

  // Filter breeds based on search query using useMemo for performance
  const filteredBreeds = useMemo(() => {
    if (!searchQuery.trim()) {
      return catBreeds; // Return all breeds if no search query
    }
    
    return catBreeds.filter(breed => 
      breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breed.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breed.temperament.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleFavoritePress = async (breed: CatBreed, event: any) => {
    // Prevent navigation when heart is pressed
    event.stopPropagation();
    await toggleFavorite(breed);
  };

  const renderBreed = ({ item }: { item: CatBreed }) => (
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
      
      {/* Favorite Heart Button */}
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={(event) => handleFavoritePress(item, event)}
      >
        <Text style={styles.favoriteIcon}>
          {isFavorite(item.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {searchQuery ? 'No breeds found matching your search' : 'No breeds available'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cat Breeds</Text>
      
      {/* Search Input with Clear Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search breeds, origins, or temperaments..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results count */}
      <Text style={styles.resultsCount}>
        {filteredBreeds.length} breed{filteredBreeds.length !== 1 ? 's' : ''} found
      </Text>

      <FlatList
        data={filteredBreeds}
        renderItem={renderBreed}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={filteredBreeds.length === 0 ? styles.emptyContainer : undefined}
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
  resultsCount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    textAlign: 'center',
  },
  breedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  favoriteButton: {
    padding: 8,
    marginLeft: 8,
  },
  favoriteIcon: {
    fontSize: 24,
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
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});