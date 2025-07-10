import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed, getLifespanString, getWeightRangeString } from '../types/CatBreed';
import { RootTabParamList } from '../types/navigation';
import { AnimatedHeart } from '../components/AnimatedHeart';
import { catImages } from '../assets/catPhotos/imageMap';


type FavoritesScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Favorites'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, isLoading, error, toggleFavorite, isFavorite, getFavorites } = useDatabase();

  const handleRetry = async () => {
    try {
      await getFavorites();
    } catch (err) {
      console.error('Retry failed:', err);
    }
  };

  const handleFavoritePress = async (breed: CatBreed, event: any) => {
    event.stopPropagation();
    if (breed.id) {
      await toggleFavorite(breed.id);
    }
  };

  const handleBreedPress = (breed: CatBreed) => {
    // Navigate to Breeds tab first, then to the detail screen
    (navigation as any).navigate('Breeds', { 
      screen: 'BreedDetail', 
      params: { breed, breedId: breed.id } 
    });
  };

  const renderBreed = ({ item }: { item: CatBreed }) => (
    <TouchableOpacity 
      style={styles.breedCard}
      onPress={() => handleBreedPress(item)}
    >
      <Image 
        source={catImages[item.image_path as keyof typeof catImages] || catImages['placeholder.jpg']}
        style={styles.breedImage}
        resizeMode="cover"
        defaultSource={require('../assets/catPhotos/placeholder.jpg')}
      />
      <View style={styles.breedInfo}>
        <View style={styles.breedHeader}>
          <Text style={styles.breedName}>{item.name}</Text>
          <View style={styles.ticaCodeBadge}>
            <Text style={styles.ticaCodeText}>{item.tica_code}</Text>
          </View>
        </View>
        
        <Text style={styles.breedOrigin}>📍 {item.origin}</Text>
        
        <View style={styles.breedDetails}>
          <Text style={styles.detailItem}>🧬 {item.coat_length}</Text>
          <Text style={styles.detailItem}>⚡ {item.activity_level}</Text>
          <Text style={styles.detailItem}>✂️ {item.grooming_needs}</Text>
        </View>
        
        <Text style={styles.breedLifespan}>
          ⏰ {getLifespanString(item)} • ⚖️ {getWeightRangeString(item)}
        </Text>
        
        <Text style={styles.breedTemperament} numberOfLines={2}>
          😸 {item.temperament}
        </Text>
      </View>
      
      <AnimatedHeart
        isFavorite={item.id ? isFavorite(item.id) : false}
        onPress={() => handleFavoritePress(item, { stopPropagation: () => {} })}
        style={styles.favoriteButton}
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateEmoji}>💔</Text>
      <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyStateText}>
        Start exploring cat breeds and tap the heart icon to add them to your favorites!
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => (navigation as any).navigate('Breeds')}
      >
        <Text style={styles.exploreButtonText}>Explore Breeds</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>❤️ My Favorites</Text>
      {favorites.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.favoritesCount}>
            {favorites.length} favorite breed{favorites.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.statsText}>
            {favorites.filter(breed => breed.activity_level === 'High').length} high-energy • {' '}
            {favorites.filter(breed => breed.grooming_needs === 'Low').length} low-maintenance
          </Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Loading your favorites...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>😿 {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={favorites}
        renderItem={renderBreed}
        keyExtractor={(item) => item.id?.toString() || item.tica_code}
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
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  statsContainer: {
    alignItems: 'center',
  },
  favoritesCount: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: 4,
  },
  statsText: {
    fontSize: 14,
    color: '#7f8c8d',
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
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  breedCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  breedImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 16,
  },
  breedInfo: {
    flex: 1,
  },
  breedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breedName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  ticaCodeBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  ticaCodeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  breedOrigin: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  breedDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailItem: {
    fontSize: 12,
    color: '#95a5a6',
    marginRight: 12,
    marginBottom: 4,
  },
  breedLifespan: {
    fontSize: 13,
    color: '#3498db',
    marginBottom: 8,
  },
  breedTemperament: {
    fontSize: 14,
    color: '#27ae60',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  favoriteButton: {
    marginLeft: 8,
    marginTop: 4,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
});