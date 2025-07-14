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
  Shadows
} from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = Spacing.md;
const CARD_WIDTH = screenWidth - (CARD_MARGIN * 2);

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

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBreeds, setFilteredBreeds] = useState<CatBreed[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'activity' | 'origin'>('name');
  const [showFilters, setShowFilters] = useState(false);

  // Load breeds when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadBreeds();
    }, [])
  );

  // Filter and sort breeds
  useEffect(() => {
    let filtered = breeds;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = breeds.filter(breed =>
        breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        breed.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        breed.temperament.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
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
  }, [breeds, searchQuery, sortBy]);

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

  const handleBreedPress = (breed: CatBreed) => {
    // @ts-ignore
    navigation.navigate('BreedDetail', { breed, breedId: breed.id });
  };

  const handleFavoritePress = useCallback((breedId: number) => {
    toggleFavorite(breedId);
  }, [toggleFavorite]);

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
      <Text style={styles.screenTitle}>Discover Cat Breeds</Text>
      <Text style={styles.screenSubtitle}>
        {filteredBreeds.length} of {breeds.length} breeds
        {searchQuery && ' matching your search'}
      </Text>
      
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search breeds..."
      />
      
      {/* Filter and Sort Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>Filters ▼</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => {
            const nextSort = sortBy === 'name' ? 'activity' : sortBy === 'activity' ? 'origin' : 'name';
            setSortBy(nextSort);
          }}
        >
          <Text style={styles.sortButtonText}>
            Sort: {sortBy === 'name' ? 'Name' : sortBy === 'activity' ? 'Activity' : 'Origin'} ▼
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBreed = useCallback(({ item }: { item: CatBreed }) => {
    const imageSource = catImages[item.tica_code as keyof typeof catImages];
    
    return (
      <Card
        variant="elevated"
        padding="none"
        margin="none"
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
            />
          </TouchableOpacity>
        </View>
        
        {/* Content Section */}
        <View style={styles.breedContent}>
          <View style={styles.breedHeader}>
            <Text style={styles.breedName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.originContainer}>
              <Text style={styles.originIcon}>📍</Text>
              <Text style={styles.breedOrigin} numberOfLines={1}>
                {item.origin}
              </Text>
            </View>
          </View>
          
          {/* Breed Stats */}
          <View style={styles.breedStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Coat:</Text>
              <Text style={styles.statValue}>{item.coat_length}</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Activity:</Text>
              <Badge 
                text={item.activity_level}
                variant={getActivityVariant(item.activity_level)}
                size="sm"
                style={styles.activityBadge}
              />
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Lifespan:</Text>
              <Text style={styles.statValue}>
                {item.lifespan_min}-{item.lifespan_max} years
              </Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Weight:</Text>
              <Text style={styles.statValue}>
                {item.weight_min_male}-{item.weight_max_male} kg
              </Text>
            </View>
          </View>
          
          {/* Temperament Tags */}
          <View style={styles.temperamentContainer}>
            {item.temperament.split(',').slice(0, 3).map((trait, index) => (
              <Badge
                key={index}
                text={trait.trim()}
                variant="secondary"
                size="sm"
                style={styles.temperamentTag}
              />
            ))}
          </View>
          
          {/* TICA Code */}
          <View style={styles.ticaContainer}>
            <Badge
              text={item.tica_code}
              variant="primary"
              size="sm"
              style={styles.ticaBadge}
            />
          </View>
        </View>
      </Card>
    );
  }, [handleFavoritePress, isFavorite]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔍</Text>
      <Text style={styles.emptyStateTitle}>No breeds found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery 
          ? 'Try adjusting your search terms' 
          : 'No cat breeds available at the moment'}
      </Text>
      {!searchQuery && (
        <Button
          title="Refresh"
          onPress={handleRefresh}
          variant="outline"
          size="md"
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

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <FlatList
          data={filteredBreeds}
          renderItem={renderBreed}
          keyExtractor={(item) => item.id?.toString() || item.tica_code}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
            />
          }
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: insets.bottom + 80 }
          ]}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
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
  
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Header section
  headerSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
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
    marginBottom: Spacing.lg,
  },
  
  // Controls
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  filterButton: {
    flex: 1,
    backgroundColor: Colors.primarySoft,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
  sortButton: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  sortButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  
  // Breed cards
  breedCard: {
    marginHorizontal: CARD_MARGIN,
    marginBottom: Spacing.lg,
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  breedImageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: Colors.surfaceVariant,
  },
  breedImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  
  // Breed content
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
  originContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originIcon: {
    fontSize: Typography.fontSize.sm,
    marginRight: Spacing.xs,
  },
  breedOrigin: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Stats
  breedStats: {
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  statValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },
  activityBadge: {
    marginLeft: Spacing.sm,
  },
  
  // Temperament
  temperamentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  temperamentTag: {
    marginRight: 0,
    marginBottom: 0,
  },
  
  // TICA code
  ticaContainer: {
    alignItems: 'flex-start',
  },
  ticaBadge: {
    marginRight: 0,
  },
  
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxxl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: Typography.fontSize.base * 1.4,
  },
  refreshButton: {
    paddingHorizontal: Spacing.xl,
  },
  
  // List
  listContainer: {
    flexGrow: 1,
  },
});