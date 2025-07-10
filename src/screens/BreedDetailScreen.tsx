// src/screens/BreedDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDatabase } from '../context/DatabaseContext';
import { CatBreed, getLifespanString, getWeightRangeString } from '../types/CatBreed';
import { RootStackParamList } from '../types/navigation';
import { AnimatedHeart } from '../components/AnimatedHeart';

type BreedDetailRouteProp = RouteProp<RootStackParamList, 'BreedDetail'>;
type BreedDetailNavigationProp = StackNavigationProp<RootStackParamList, 'BreedDetail'>;

interface Props {
  route: BreedDetailRouteProp;
}

export default function BreedDetailScreen({ route }: Props) {
  const navigation = useNavigation<BreedDetailNavigationProp>();
  const { toggleFavorite, isFavorite, getBreedById } = useDatabase();
  const [breed, setBreed] = useState<CatBreed>(route.params.breed);
  const [isLoading, setIsLoading] = useState(false);

  // If we have a breedId, fetch the latest data
  useEffect(() => {
    if (route.params.breedId && route.params.breedId !== breed.id) {
      loadBreedDetails();
    }
  }, [route.params.breedId]);

  const loadBreedDetails = async () => {
    if (!route.params.breedId) return;
    
    setIsLoading(true);
    try {
      const latestBreed = await getBreedById(route.params.breedId);
      if (latestBreed) {
        setBreed(latestBreed);
      }
    } catch (error) {
      console.error('Error loading breed details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoritePress = async () => {
    if (breed.id) {
      await toggleFavorite(breed.id);
    }
  };

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return '#95a5a6';
      case 'Low-Medium': return '#f39c12';
      case 'Medium': return '#3498db';
      case 'Medium-High': return '#e67e22';
      case 'High': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getGroomingLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return '#27ae60';
      case 'Low-Medium': return '#2ecc71';
      case 'Medium': return '#f39c12';
      case 'Medium-High': return '#e67e22';
      case 'High': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const renderInfoCard = (title: string, content: string, icon: string, color?: string) => (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <Text style={styles.infoIcon}>{icon}</Text>
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Text style={[styles.infoContent, color && { color }]}>{content}</Text>
    </View>
  );

  const renderStatBar = (label: string, level: string, color: string) => (
    <View style={styles.statBar}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarContainer}>
        <View style={styles.statBarBackground}>
          <View 
            style={[
              styles.statBarFill, 
              { backgroundColor: color, width: getStatWidth(level) }
            ]} 
          />
        </View>
        <Text style={[styles.statValue, { color }]}>{level}</Text>
      </View>
    </View>
  );

  const getStatWidth = (level: string) => {
    const levels = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High'];
    const index = levels.indexOf(level);
    return `${Math.max(20, (index + 1) * 20)}%` as any; // Cast to any for React Native percentage support
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading breed details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Image */}
      <View style={styles.header}>
        <Image 
          source={{ uri: `asset:///catPhotos/${breed.image_path}` }}
          style={styles.breedImage}
          resizeMode="cover"
          defaultSource={require('../assets/catPhotos/placeholder.jpg')}
        />
        <View style={styles.headerOverlay}>
          <View style={styles.headerContent}>
            <View style={styles.breedTitleContainer}>
              <Text style={styles.breedName}>{breed.name}</Text>
              <View style={styles.ticaCodeBadge}>
                <Text style={styles.ticaCodeText}>{breed.tica_code}</Text>
              </View>
            </View>
            <Text style={styles.breedOrigin}>📍 {breed.origin}</Text>
          </View>
          <AnimatedHeart
            isFavorite={breed.id ? isFavorite(breed.id) : false}
            onPress={handleFavoritePress}
            style={styles.favoriteButton}
          />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{getLifespanString(breed)}</Text>
          <Text style={styles.statLabel}>Lifespan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{breed.coat_length}</Text>
          <Text style={styles.statLabel}>Coat</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{getWeightRangeString(breed)}</Text>
          <Text style={styles.statLabel}>Weight</Text>
        </View>
      </View>

      {/* Activity & Grooming Levels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Care Requirements</Text>
        {renderStatBar('Activity Level', breed.activity_level, getActivityLevelColor(breed.activity_level))}
        {renderStatBar('Grooming Needs', breed.grooming_needs, getGroomingLevelColor(breed.grooming_needs))}
      </View>

      {/* Physical Characteristics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Physical Characteristics</Text>
        <View style={styles.characteristicsGrid}>
          {renderInfoCard('Body Type', breed.body_type, '🏗️')}
          {breed.coat_pattern && renderInfoCard('Coat Pattern', breed.coat_pattern, '🎨')}
          {renderInfoCard('Weight (Female)', getWeightRangeString(breed, 'female'), '⚖️')}
          {renderInfoCard('Weight (Male)', getWeightRangeString(breed, 'male'), '⚖️')}
        </View>
      </View>

      {/* Temperament */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temperament</Text>
        <View style={styles.temperamentContainer}>
          {breed.temperament.split(',').map((trait, index) => (
            <View key={index} style={styles.temperamentTag}>
              <Text style={styles.temperamentText}>{trait.trim()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Breed</Text>
        <Text style={styles.description}>{breed.description}</Text>
      </View>

      {/* Care Information */}
      {breed.care_requirements && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Requirements</Text>
          <Text style={styles.careText}>{breed.care_requirements}</Text>
        </View>
      )}

      {/* Ideal For */}
      {breed.ideal_for && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ideal For</Text>
          <Text style={styles.idealForText}>{breed.ideal_for}</Text>
        </View>
      )}

      {/* Health Information */}
      {breed.health_issues && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Considerations</Text>
          <View style={styles.healthContainer}>
            <Text style={styles.healthIcon}>🏥</Text>
            <Text style={styles.healthText}>{breed.health_issues}</Text>
          </View>
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  header: {
    position: 'relative',
    height: 300,
  },
  breedImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerContent: {
    flex: 1,
  },
  breedTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  breedName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  ticaCodeBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  ticaCodeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  breedOrigin: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  favoriteButton: {
    marginLeft: 16,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e1e8ed',
    marginHorizontal: 16,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  statBar: {
    marginBottom: 16,
  },
  statBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e1e8ed',
    borderRadius: 4,
    marginRight: 12,
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'right',
  },
  characteristicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  infoContent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  temperamentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  temperamentTag: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  temperamentText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  careText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#27ae60',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  idealForText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#8e44ad',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  healthContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  healthIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  healthText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#856404',
  },
  bottomSpacing: {
    height: 40,
  },
});