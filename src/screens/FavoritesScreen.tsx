import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CatBreed } from '../data/catBreeds';
import { RootStackParamList } from '../types/navigation';
import { useFavorites } from '../context/FavoritesContext';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, isLoading, toggleFavorite } = useFavorites();

  const handleFavoritePress = async (breed: CatBreed, event: any) => {
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
      
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={(event) => handleFavoritePress(item, event)}
      >
        <Text style={styles.favoriteIcon}>❤️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateEmoji}>💔</Text>
      <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyStateText}>
        Start exploring cat breeds and tap the heart icon to add them to your favorites!
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ My Favorites</Text>
      
      {favorites.length > 0 && (
        <Text style={styles.favoritesCount}>
          {favorites.length} favorite breed{favorites.length !== 1 ? 's' : ''}
        </Text>
      )}

      <FlatList
        data={favorites}
        renderItem={renderBreed}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={favorites.length === 0 ? styles.emptyContainer : styles.listContainer}
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
  favoritesCount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
});