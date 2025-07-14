
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
      const filtered = favorites.filter(breed =>
        breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        breed.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        breed.temperament.toLowerCase().includes(searchQuery.toLowerCase()) ||
        breed.tica_code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFavorites(filtered);
    } else {
      setFilteredFavorites(favorites);
    }
  }, [favorites, searchQuery]);

  // Handlers
  const loadFavorites = async () => {
    try {
      await getFavorites();
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getFavorites();
    } catch (error) {
      console.error('Error refreshing favorites:', error);
    } finally {
      setRefreshing(false);
    }
  }, [getFavorites]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleBreedPress = useCallback((breed: CatBreed) => {
    // @ts-ignore
    navigation.navigate('Breeds', {
      screen: 'BreedDetail',
      params: { breed, breedId: breed.id }
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
    // @ts-ignore
    navigation.navigate('Breeds');
  }, [navigation]);

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
      <Text style={styles.screenTitle}>Your Favorites</Text>
      <Text style={styles.screenSubtitle}>
        {filteredFavorites.length} of {favorites.length} breeds
        {searchQuery && ' matching your search'}
      </Text>
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
    if (searchQuery.trim() && filteredFavorites.length === 0 && favorites.length > 0) {
      // No search results in favorites
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateEmoji}>🔍</Text>
          <Text style={styles.emptyStateTitle}>No matches found</Text>
          <Text style={styles.emptyStateText}>
            None of your favorite breeds match "{searchQuery}". Try a different search term.
          </Text>
          <Button
            title="Clear Search"
            onPress={clearSearch}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      );
    }

    if (favorites.length === 0) {
      // No favorites at all
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateEmoji}>💔</Text>
          <Text style={styles.emptyStateTitle}>No favorites yet</Text>
          <Text style={styles.emptyStateText}>
            Start exploring cat breeds and tap the heart icon to save your favorites here.
          </Text>
          <Button
            title="🔍  Explore Breeds"
            onPress={navigateToBreeds}
            variant="primary"
            style={styles.actionButton}
          />
        </View>
      );
    }

    return null;
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading your favorites...</Text>
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
        style={styles.actionButton}
      />
    </View>
  );

  // Stats summary component
  const renderStatsCard = () => {
    if (favorites.length === 0) return null;

    // Calculate some interesting stats
    const origins = [...new Set(favorites.map(breed => breed.origin))];
    const activityLevels = favorites.map(breed => breed.activity_level);
    const mostCommonActivity = activityLevels.sort((a, b) =>
      activityLevels.filter(v => v === a).length - activityLevels.filter(v => v === b).length
    ).pop();

    return (
      <View style={styles.statsSection}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{origins.length}</Text>
            <Text style={styles.statLabel}>Origins</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mostCommonActivity}</Text>
            <Text style={styles.statLabel}>Most Liked</Text>
          </View>
        </View>
      </View>
    );
  };

  // Quick action buttons
  const renderQuickActions = () => {
    if (favorites.length === 0) return null;

    return (
      <View style={styles.quickActionsSection}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => {
            console.log('Share favorites functionality');
          }}
        >
          <Text style={styles.quickActionIcon}>📤</Text>
          <Text style={styles.quickActionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => {
            console.log('Export favorites functionality');
          }}
        >
          <Text style={styles.quickActionIcon}>💾</Text>
          <Text style={styles.quickActionText}>Export</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={navigateToBreeds}
        >
          <Text style={styles.quickActionIcon}>➕</Text>
          <Text style={styles.quickActionText}>Add More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Main render
  if (isLoading && favorites.length === 0) {
    return renderLoadingState();
  }

  if (error && favorites.length === 0) {
    return renderErrorState();
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        {/* Header */}
        {renderHeader()}

        {/* Search Bar - only show if there are favorites */}
        {favorites.length > 0 && (
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onClear={clearSearch}
            placeholder="Search your favorites..."
          />
        )}

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Favorites List */}
        <FlatList
          data={filteredFavorites}
          renderItem={renderBreed}
          keyExtractor={(item) => item.id?.toString() || item.tica_code}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            filteredFavorites.length === 0 
              ? styles.emptyContainer 
              : styles.listContainer
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={10}
          initialNumToRender={6}
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
    minWidth: 140,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: Layout.content.paddingHorizontal,
    paddingBottom: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  statNumber: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  
  // Quick Actions
  quickActionsSection: {
    flexDirection: 'row',
    paddingHorizontal: Layout.content.paddingHorizontal,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    ...Shadows.xs,
  },
  quickActionIcon: {
    fontSize: Typography.fontSize.lg,
    marginBottom: Spacing.xs,
  },
  quickActionText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  
  // List Containers
  emptyContainer: {
    flexGrow: 1,
  },
  listContainer: {
    paddingBottom: Layout.tabBar.heightSafe,
  },
});