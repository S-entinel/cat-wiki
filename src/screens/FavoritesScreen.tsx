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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
  Layout,
  Shadows
} from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const {
    favorites,
    isLoading,
    error,
    getFavorites,
    toggleFavorite,
    isFavorite,
  } = useDatabase();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState<CatBreed[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Filter favorites based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = favorites.filter(breed =>
        breed.name.toLowerCase().includes(query) ||
        breed.origin.toLowerCase().includes(query) ||
        breed.temperament.toLowerCase().includes(query) ||
        breed.activity_level.toLowerCase().includes(query)
      );
      setFilteredFavorites(filtered);
    } else {
      setFilteredFavorites(favorites);
    }
  }, [favorites, searchQuery]);

  const loadFavorites = async () => {
    try {
      await getFavorites();
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
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

  const navigateToBreeds = useCallback(() => {
    // @ts-ignore - Navigation types
    navigation.navigate('Breeds');
  }, [navigation]);


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
      <Text style={styles.screenTitle}>Your Favorites</Text>
      <Text style={styles.screenSubtitle}>
        {filteredFavorites.length} of {favorites.length} breeds
        {searchQuery && ' matching your search'}
      </Text>
      
      {favorites.length > 0 && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search your favorites..."
        />
      )}
    </View>
  );

  const renderBreed = useCallback(({ item }: { item: CatBreed }) => {
    const imageSource = getImageSource(item);
    
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
        
        {/* Content Section */}
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
          
          {/* Stats */}
          <View style={styles.breedStats}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Activity</Text>
                <Badge
                  text={item.activity_level}
                  variant={getActivityVariant(item.activity_level)}
                  size="xs"
                />
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

          {/* Temperament */}
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
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateEmoji}>😸</Text>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No favorites match your search' : 'No favorites yet'}
      </Text>
      <Text style={styles.emptyStateText}>
        {searchQuery 
          ? 'Try adjusting your search terms to find your favorite breeds'
          : 'Start exploring cat breeds and tap the heart icon to save your favorites here!'
        }
      </Text>
      {!searchQuery && (
        <Button
          title="Discover Breeds"
          onPress={navigateToBreeds}
          variant="primary"
          size="lg"
          style={styles.actionButton}
        />
      )}
    </View>
  );

  if (isLoading && favorites.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your favorites...</Text>
      </View>
    );
  }

  if (error && favorites.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Unable to load favorites</Text>
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
        data={filteredFavorites}
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
          filteredFavorites.length === 0 && styles.emptyListContainer
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
  
  // List
  list: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: Layout.tabBar.heightSafe,
  },
  emptyListContainer: {
    justifyContent: 'center',
  },
  
  // Header
  headerSection: {
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.content.paddingHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
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
    marginBottom: Spacing.lg,
  },
  
  // Breed Cards
  breedCard: {
    marginHorizontal: Layout.content.paddingHorizontal,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  breedImageContainer: {
    position: 'relative',
    height: 180,
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
    alignItems: 'center',
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
  actionButton: {
    minWidth: 200,
  },
});